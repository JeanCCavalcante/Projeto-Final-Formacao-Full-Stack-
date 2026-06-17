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
    
    # DATA DE CORTE FIEL (Evita datas exageradas)
    databcorte = pd.to_datetime('2026-05-31')
    
    # CONVERSÃO DE DATAS
    tabela['data_criacao'] = pd.to_datetime(tabela.get('data_criacao'), errors='coerce')
    tabela['data_inicio'] = pd.to_datetime(tabela.get('data_inicio'), errors='coerce')
    tabela['data_conclusao'] = pd.to_datetime(tabela.get('data_conclusao'), errors='coerce')

    #  LÓGICA DE DURAÇÃO EM DIAS (Baseada  na Data de Corte)
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

    #  TEMPO NO BACKLOG
    tabela['tempo_no_backlog'] = np.where(
        tabela['status_atual'] == 'pendente',
        (databcorte - tabela['data_criacao']).dt.days,
        (tabela['data_inicio'] - tabela['data_criacao']).dt.days
    )

    # CÁLCULO DA META (Baseado no histórico real de concluídas por prioridade)
    historico_geral = tabela[tabela['status_atual'] == 'concluida']
    media_por_prioridade = historico_geral.groupby('prioridade')['duracao_em_dias'].mean().round(1)
    tabela['meta_dias'] = tabela['prioridade'].map(media_por_prioridade)

    # DIAGNÓSTICO DE STATUS 
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

    #  EXTRAÇÃO DAS SPRINTS ()
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
    
    # Funções auxiliares
    def safe_float(val): return float(val) if pd.notna(val) else 0.0
    def safe_int(val): return int(val) if pd.notna(val) else 0

    def calcular_saude_estimativas(df):
        concluidas = df[df['status_atual'] == 'concluida']
        if concluidas.empty: return 100.0
        no_prazo = concluidas[concluidas['duracao_em_dias'] <= concluidas['meta_dias']]
        return round((len(no_prazo) / len(concluidas)) * 100, 1)

    # 1. VISÃO GERAL
    concluidas_geral = tabela[tabela['status_atual'] == 'concluida']
    df_sprints_geral = concluidas_geral.groupby('sprint_num').agg({'nome_sprint': 'first', 'duracao_em_dias': 'mean', 'meta_dias': 'mean'}).sort_values('sprint_num')

    dashboard_data['visao_geral'] = {
        "cards": {
            "foco_atual_qtd": len(tabela[tabela['status_atual'] == 'andamento']),
            "ritmo_jornada_dias": safe_float(concluidas_geral['duracao_em_dias'].mean().round(1) if not concluidas_geral.empty else 0),
            "pontos_destrava_qtd": len(tabela[tabela['Diagnostico'].str.contains('🔴', na=False, regex=False)]),
            "saude_estimativas_pct": safe_float(calcular_saude_estimativas(tabela))
        },
        "grafico_esforco": {
            "titulo": "Distribuição do Esforço Atual",
            "dados": [{"status": str(s), "quantidade": safe_int(q)} for s, q in tabela['status_atual'].value_counts().items()]
        },
        "grafico_ritmo": {
            "titulo": "Evolução do Ritmo (Sprints)",
            "series": {
                "sprints": df_sprints_geral['nome_sprint'].tolist(),
                "dias_gastos": [round(x, 1) for x in df_sprints_geral['duracao_em_dias'].tolist()],
                "meta_esperada": [round(x, 1) for x in df_sprints_geral['meta_dias'].tolist()]
            }
        }
    }

    # 2. VISÃO MENTORADA (Loop pelos alunos)
    dashboard_data['visao_mentorada'] = {}
    lista_mentorados = tabela['mentorado'].dropna().unique()

    for nome in lista_mentorados:
        tabela_m = tabela[tabela['mentorado'] == nome]
        concluidas_m = tabela_m[tabela_m['status_atual'] == 'concluida']
        df_sprints_m = concluidas_m.groupby('sprint_num').agg({'nome_sprint': 'first', 'duracao_em_dias': 'mean', 'meta_dias': 'mean'}).sort_values('sprint_num')
        
        dashboard_data['visao_mentorada'][nome] = {
            "cards": {
                "foco_atual_qtd": len(tabela_m[tabela_m['status_atual'] == 'andamento']),
                "ritmo_jornada_dias": safe_float(concluidas_m['duracao_em_dias'].mean().round(1) if not concluidas_m.empty else 0),
                "pontos_destrava_qtd": len(tabela_m[tabela_m['Diagnostico'].str.contains('🔴', na=False, regex=False)]),
                "saude_estimativas_pct": safe_float(calcular_saude_estimativas(tabela_m))
            },
            "grafico_esforco": {
                "titulo": "Distribuição do Esforço Atual",
                "dados": [{"status": str(s), "quantidade": safe_int(q)} for s, q in tabela_m['status_atual'].value_counts().items()]
            },
            "grafico_ritmo": {
                "titulo": "Evolução do Ritmo (Sprints)",
                "series": {
                    "sprints": df_sprints_m['nome_sprint'].tolist(),
                    "dias_gastos": [round(x, 1) for x in df_sprints_m['duracao_em_dias'].tolist()],
                    "meta_esperada": [round(x, 1) for x in df_sprints_m['meta_dias'].tolist()]
                }
            }
        }
        
    return dashboard_data