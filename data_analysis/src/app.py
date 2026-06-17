
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import re
from datetime import datetime
from canexao import connect_to_mongo

app = FastAPI(title="API Focus - Dashboard de Mentoria")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
#ajustes contra possíveis erros
# ==========================================
def para_camel_case(texto):
    if not isinstance(texto, str):
        return texto
    palavras = re.sub(r'[-_/\s]+', ' ', texto).strip().split()
    if not palavras:
        return ""
    return palavras[0].lower() + "".join(p.capitalize() for p in palavras[1:])

def safe_mean(serie):
    if serie.empty: return 0.0
    val = serie.mean()
    return 0.0 if pd.isna(val) else round(float(val), 1)

def safe_median(serie):
    if serie.empty: return 0.0
    val = serie.median()
    return 0.0 if pd.isna(val) else round(float(val), 1)

# ==========================================
# diagnostico de tabela(n sera usado no dash)
# ==========================================
def calcular_diagnostico_global(linha):
    status = linha.get('status_atual')
    dias = linha.get('duracao_em_dias', 0)
    meta = linha.get('meta_dias', 10.0) 
    if pd.isna(meta): meta = 10.0

    if status == 'pendente':
        return '🔴 Crítico (Fila)' if dias > 10 else '⚪ Pendente Normal'
        
    elif status == 'andamento':
        if dias > (meta * 2):
            return '🔴 Crítico (Execução)'
        elif dias > meta:
            return '🟡 Atrasado'
        else:
            return '🟢 Dentro do Prazo'
            
    return '✔️ Entregue'


def carregar_e_processar_dados():
    collection_users, collection_tasks = connect_to_mongo()
    dados = list(collection_tasks.find())    
    
    if not dados:
        return pd.DataFrame()
    
    tabela_tarefas = pd.DataFrame(dados)
    hoje = pd.Timestamp.now()
    
    # 1. Tratamento de Datas (Usando data_criacao como no Notebook)
    tabela_tarefas['data_criacao'] = pd.to_datetime(tabela_tarefas.get('data_criacao'), errors='coerce')
    tabela_tarefas['data_inicio'] = pd.to_datetime(tabela_tarefas.get('data_inicio'), errors='coerce')
    tabela_tarefas['data_conclusao'] = pd.to_datetime(tabela_tarefas.get('data_conclusao'), errors='coerce')

    # 2. Lógica de Tempos (Blindada contra negativos)
    tabela_tarefas['duracao_em_dias'] = 0.0
    
    # Tarefas Concluídas
    task_concluida = tabela_tarefas['status_atual'] == 'concluida'
    tabela_tarefas.loc[task_concluida, 'duracao_em_dias'] = (tabela_tarefas.loc[task_concluida, 'data_conclusao'] - tabela_tarefas.loc[task_concluida, 'data_inicio']).dt.days
    
    # Tarefas em Andamento
    task_andamento = tabela_tarefas['status_atual'] == 'andamento'
    tabela_tarefas.loc[task_andamento, 'duracao_em_dias'] = (hoje - tabela_tarefas.loc[task_andamento, 'data_inicio']).dt.days

    # Tarefas Pendentes
    task_pendente = tabela_tarefas['status_atual'] == 'pendente'
    tabela_tarefas.loc[task_pendente, 'duracao_em_dias'] = (hoje - tabela_tarefas.loc[task_pendente, 'data_criacao']).dt.days
    
    # Tempo de Backlog
    tempo_backlog_calc = np.where(
        tabela_tarefas['status_atual'] == 'pendente',
        (hoje - tabela_tarefas['data_criacao']).dt.days,
        (tabela_tarefas['data_inicio'] - tabela_tarefas['data_criacao']).dt.days
    )
    tabela_tarefas['tempo_no_backlog'] = pd.Series(tempo_backlog_calc).fillna(0).clip(lower=0)

    # Limpeza de negativos em caso de erro de digitação no BD
    tabela_tarefas['duracao_em_dias'] = tabela_tarefas['duracao_em_dias'].fillna(0).clip(lower=0)

    # 3. Lógica de Metas Baseada no Histórico
    historico_concluido = tabela_tarefas[tabela_tarefas['status_atual'] == 'concluida']
    media_por_prioridade = historico_concluido.groupby('prioridade')['duracao_em_dias'].mean().round(1)
    
    # Injetamos a meta na tabela cruzando a prioridade
    tabela_tarefas['meta_dias'] = tabela_tarefas['prioridade'].map(media_por_prioridade).fillna(10.0)
    
    return tabela_tarefas

# ==========================================
 #Endpoint (A Entrega para o Angular)
# ==========================================
@app.get("/metrics")
def obtener_metricas():
    tabela_tarefas = carregar_e_processar_dados()
    if tabela_tarefas.empty: return {"mensagem": "Sem dados"}

    # ---------------------------------------------------------
    # PREPARAR OS DADOS DO NOVO GRÁFICO CENTRAL (Tarefas Ativas)
    # ---------------------------------------------------------
    tabela_ativas = tabela_tarefas[tabela_tarefas['status_atual'].isin(['andamento', 'pendente'])].copy()
    
    if not tabela_ativas.empty:
        # Aplica as regras de cores da Ana Ribeiro (Diagnóstico)
        tabela_ativas['Diagnostico'] = tabela_ativas.apply(calcular_diagnostico_global, axis=1)
        # Limpeza para garantir que não há 'NaN' a quebrar o JSON
        tabela_ativas = tabela_ativas.replace({np.nan: None, pd.NaT: None})

    # ---------------------------------------------------------
    # VISÃO GERAL (a visão da junção de todos os mentorados)
   
    visao_geral = {
        "cards": {
            "totalAtividades": int(tabela_tarefas.shape[0]),
            "atividadesAtrasadas": int(tabela_ativas[tabela_ativas['Diagnostico'].str.contains('🔴|🟡', na=False)].shape[0]) if not tabela_ativas.empty else 0,
            "tempoMedioAtividade": safe_mean(tabela_tarefas[tabela_tarefas['status_atual'] == 'concluida']['duracao_em_dias']),
            "backlogGeral": int(tabela_tarefas[tabela_tarefas['status_atual'] == 'pendente'].shape[0])
        },
        "distribuicaoStatus": [{"status": para_camel_case(k), "quantidade": int(v)} for k, v in tabela_tarefas['status_atual'].value_counts().items()],
        "graficoRiscoAtivo": tabela_ativas[['titulo', 'mentorado', 'prioridade', 'status_atual', 'duracao_em_dias', 'meta_dias', 'Diagnostico']].to_dict(orient='records') if not tabela_ativas.empty else []
    }

    
    #Mentorada
    mentorados_detalhes = {}
    lista_mentorados = [m for m in tabela_tarefas['mentorado'].unique() if pd.notna(m)]
    
    for nome in lista_mentorados:
        tabela_m = tabela_tarefas[tabela_tarefas['mentorado'] == nome]
        ativas_m = tabela_ativas[tabela_ativas['mentorado'] == nome] if not tabela_ativas.empty else pd.DataFrame()
        
        mentorados_detalhes[nome] = {
            "cards": {
                "totalSubmetidas": int(tabela_m.shape[0]),
                "mediaDiasConcluida": safe_mean(tabela_m[tabela_m['status_atual'] == 'concluida']['duracao_em_dias']),
                "medianaBacklog": safe_median(tabela_m['tempo_no_backlog']),
                "atividadesAndamento": int(tabela_m[tabela_m['status_atual'] == 'andamento'].shape[0])
            },
            "distribuicaoStatus": [{"status": para_camel_case(k), "quantidade": int(v)} for k, v in tabela_m['status_atual'].value_counts().items()],
            "graficoRiscoAtivo": ativas_m[['titulo', 'prioridade', 'status_atual', 'duracao_em_dias', 'meta_dias', 'Diagnostico']].to_dict(orient='records') if not ativas_m.empty else []
        }

    return {
        "visaoGeral": visao_geral,
        "mentorados": mentorados_detalhes
    }