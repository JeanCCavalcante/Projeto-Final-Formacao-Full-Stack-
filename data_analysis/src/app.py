from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import re
from canexao import connect_to_mongo

app = FastAPI(title="API Focus - Dashboard de Mentoria")

# Permitir conexão com o Front-End (Angular)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],  # Altere para o domínio do seu front-end em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def carregar_e_processar_dados():
    collection_users, collection_tasks = connect_to_mongo()
    dados = list(collection_tasks.find())    
    
    if not dados:
        return pd.DataFrame()
    
    tabela = pd.DataFrame(dados)
    
    # ⏱️ 1. DATA DE CORTE FIEL AO NOTEBOOK (Evita datas exageradas)
    databcorte = pd.to_datetime('2026-05-31')
    
    # 📅 2. CONVERSÃO DE DATAS
    tabela['data_criacao'] = pd.to_datetime(tabela.get('data_criacao'), errors='coerce')
    tabela['data_inicio'] = pd.to_datetime(tabela.get('data_inicio'), errors='coerce')
    tabela['data_conclusao'] = pd.to_datetime(tabela.get('data_conclusao'), errors='coerce')

    # ⏳ 3. LÓGICA DE DURAÇÃO EM DIAS (Baseada estritamente na Data de Corte)
    tabela['duracao_em_dias'] = np.nan
    
    # Tarefas Concluídas: Dias reais entre início e conclusão
    task_concluida = tabela['status_atual'] == 'concluida'
    tabela.loc[task_concluida, 'duracao_em_dias'] = (tabela.loc[task_concluida, 'data_conclusao'] - tabela.loc[task_concluida, 'data_inicio']).dt.days
    
    # Tarefas em Andamento: Tempo decorrido congelado na data de corte
    task_andamento = tabela['status_atual'] == 'andamento'
    tabela.loc[task_andamento, 'duracao_em_dias'] = (databcorte - tabela.loc[task_andamento, 'data_inicio']).dt.days
    
    # Tarefas Pendentes: Tempo na fila congelado na data de corte
    task_pendente = tabela['status_atual'] == 'pendente'
    tabela.loc[task_pendente, 'duracao_em_dias'] = (databcorte - tabela.loc[task_pendente, 'data_criacao']).dt.days

    # ⏱️ 4. TEMPO NO BACKLOG
    tabela['tempo_no_backlog'] = np.where(
        tabela['status_atual'] == 'pendente',
        (databcorte - tabela['data_criacao']).dt.days,
        (tabela['data_inicio'] - tabela['data_criacao']).dt.days
    )

    # 🎯 5. CÁLCULO DA META (Baseado no histórico real de concluídas por prioridade)
    historico_geral = tabela[tabela['status_atual'] == 'concluida']
    media_por_prioridade = historico_geral.groupby('prioridade')['duracao_em_dias'].mean().round(1)
    tabela['meta_dias'] = tabela['prioridade'].map(media_por_prioridade)

    # 🚦 6. DIAGNÓSTICO DE STATUS (Sem invenção de dados se a meta for NaN)
    def sinalizar_status_real(linha):
        dias = linha.get('duracao_em_dias')
        meta = linha.get('meta_dias')
        
        if pd.isna(meta) or pd.isna(dias): 
            return None
        
        status = linha.get('status_atual')
        if status == 'pendente':
            return '🔴 Crítico (Fila)' if dias > 10 else '⚪ Pendente Normal'
        elif status == 'andamento':
            if dias > (meta * 2): return '🔴 Crítico'
            elif dias > meta: return '🟡 Atrasado'
            else: return '🟢 Dentro do Prazo'
        else:
            return '✔️ Entregue'

    tabela['Diagnostico'] = tabela.apply(sinalizar_status_real, axis=1)
    tabela['dias_de_atraso'] = tabela['duracao_em_dias'] - tabela['meta_dias']

    # 📊 7. EXTRAÇÃO DAS SPRINTS (Essencial para o Gráfico de Dispersão)
    if 'titulo' in tabela.columns:
        tabela['sprint_num'] = tabela['titulo'].str.extract(r'Sprint (\d+)').fillna(0).astype(int)
        tabela['nome_sprint'] = tabela['titulo'].str.extract(r'(Sprint \d+)').fillna('Sem Sprint')
    else:
        tabela['sprint_num'] = 0
        tabela['nome_sprint'] = 'Sem Sprint'

    return tabela

@app.get("/metrics")
def obter_metricas():
    tabela = carregar_e_processar_dados()
    if tabela.empty: return {"mensagem": "Sem dados disponíveis"}
    
    dashboard_data = {}
    
    # Funções auxiliares para limpar nulos e manter o JSON válido
    def safe_float(val): return float(val) if pd.notna(val) else None
    def safe_int(val): return int(val) if pd.notna(val) else None
    def df_to_clean_dict(df): return df.where(pd.notnull(df), None).to_dict(orient='records')

    # =========================================================================
    # VISÃO GERAL (PAINEL DO MENTOR)
    # =========================================================================
    concluidas_equipe = tabela[tabela['status_atual'] == 'concluida']
    media_equipe = safe_float(concluidas_equipe['duracao_em_dias'].mean()) or 0.0
    
    status_qtd = tabela['status_atual'].value_counts()
    status_pct = (status_qtd / status_qtd.sum() * 100).round(1)
    pendentes_por_area = tabela[tabela['status_atual'].isin(['andamento', 'pendente'])]['area_atuacao'].value_counts()

    dashboard_data['visao_geral_equipe'] = {
        "cards": {
            "tempo_medio_execucao_geral_dias": safe_float(tabela['duracao_em_dias'].mean()),
            "mediana_tempo_geral_dias": safe_float(tabela['duracao_em_dias'].median()),
            "tarefa_mais_demorada_equipe_dias": safe_float(tabela['duracao_em_dias'].max())
        },
        "grafico_pizza_status_geral": [
            {"status": s, "quantidade": safe_int(q), "percentual": safe_float(p)}
            for s, q, p in zip(status_qtd.index, status_qtd.values, status_pct.values)
        ],
        "grafico_gargalos_por_area": [
            {"area": a, "quantidade_tarefas_ativas": safe_int(q)}
            for a, q in zip(pendentes_por_area.index, pendentes_por_area.values)
        ],
        "tabela_mentores_status": [
            {"mentor": str(mentor), "status_tarefas": row.to_dict()}
            for mentor, row in pd.crosstab(tabela['mentor_responsavel'], tabela['status_atual']).iterrows()
        ]
    }

    # =========================================================================
    # Mentorada

    lista_mentorados = [m for m in tabela['mentorado'].unique() if pd.notna(m)]
    mentorados_detalhes = {}
    
    for nome in lista_mentorados:
        tabela_m = tabela[tabela['mentorado'] == nome].copy()
        
        # 🎯 DADOS PARA O GRÁFICO DE DISPERSÃO (Apenas tarefas Concluídas)
        df_plot = tabela_m[tabela_m['status_atual'] == 'concluida'].copy()
        df_plot = df_plot.sort_values('sprint_num')
        
        pontos_dispersao = [
            {
                "titulo_tarefa": str(linha['titulo']),
                "sprint_sequencial": safe_int(linha['sprint_num']),
                "nome_sprint": str(linha['nome_sprint']),
                "dias_gastos_reais": safe_float(linha['duracao_em_dias']),
                "meta_esperada_dias": safe_float(linha['meta_dias']),
                "prioridade": str(linha['prioridade'])
            }
            for _, linha in df_plot.iterrows()
        ]
        
        # Separando Tabelas Auxiliares de Atividades Ativas
        ativas_m = tabela_m[tabela_m['status_atual'].isin(['andamento', 'pendente'])].copy()
        colunas_export = ['titulo', 'prioridade', 'status_atual', 'duracao_em_dias', 'meta_dias', 'Diagnostico']
        
        if not ativas_m.empty:
            ativas_m = ativas_m.sort_values(by='dias_de_atraso', ascending=False)
            ativas_m['Diagnostico_str'] = ativas_m['Diagnostico'].fillna('')
            tabela_criticas = ativas_m[ativas_m['Diagnostico_str'].str.contains('🔴|🟡')][colunas_export]
            tabela_saudaveis = ativas_m[ativas_m['Diagnostico_str'].str.contains('🟢|⚪')][colunas_export]
        else:
            tabela_criticas = pd.DataFrame(columns=colunas_export)
            tabela_saudaveis = pd.DataFrame(columns=colunas_export)
        
        st_qtd_m = tabela_m['status_atual'].value_counts()
        st_pct_m = (st_qtd_m / st_qtd_m.sum() * 100).round(1)

        mentorados_detalhes[nome] = {
            "cards": {
                "tempo_backlog_mediana_dias": safe_float(tabela_m['tempo_no_backlog'].median()),
                "total_atividades_submetidas": safe_int(len(tabela_m)),
                "tempo_medio_conclusao_dias": safe_float(tabela_m[tabela_m['status_atual'] == 'concluida']['duracao_em_dias'].mean()),
                "atividades_em_andamento_atual": safe_int(len(tabela_m[tabela_m['status_atual'] == 'andamento']))
            },
            "grafico_pizza_status": [
                {"status": s, "quantidade": safe_int(q), "percentual": safe_float(p)}
                for s, q, p in zip(st_qtd_m.index, st_qtd_m.values, st_pct_m.values)
            ],
            # Estrutura perfeita para plotar o Gráfico de Dispersão no Angular (com a linha de referência da equipe)
            "grafico_dispersao_evolucao": {
                "linha_referencia_media_equipe_dias": safe_float(media_equipe),
                "pontos_entregas": pontos_dispersao
            },
            "tabela_atividades_criticas": df_to_clean_dict(tabela_criticas),
            "tabela_atividades_saudaveis": df_to_clean_dict(tabela_saudaveis)
        }
        
    dashboard_data['visao_individual_mentorada'] = mentorados_detalhes
    
    return dashboard_data