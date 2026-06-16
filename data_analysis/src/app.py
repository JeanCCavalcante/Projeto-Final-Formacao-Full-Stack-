from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import re
import math
from datetime import datetime

from canexao import connect_to_mongo

app = FastAPI(title="API de Métricas da Mentoria")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔄 Função auxiliar para converter strings para camelCase
def para_camel_case(texto):
    if not isinstance(texto, str):
        return texto
    palavras = re.sub(r'[-_/\s]+', ' ', texto).strip().split()
    if not palavras:
        return ""
    return palavras[0].lower() + "".join(p.capitalize() for p in palavras[1:])

# 🚦 Função do seu Notebook para gerar o Diagnóstico
def calcular_diagnostico_global(linha):
    status = linha.get('status_atual')
    dias = linha.get('dias_decorridos', 0)
    
    if status == 'pendente':
        meta_fila = linha.get('meta_backlog', 2.0)
        if pd.isna(meta_fila): meta_fila = 2.0 # Margem de segurança
        
        if dias > (meta_fila * 2): return '🔴 Crítico (Fila)'
        elif dias > meta_fila:     return '🟡 Alerta (Fila)'
        else:                      return '⚪ Pendente Normal'
        
    elif status == 'andamento':
        meta_exec = linha.get('meta_execucao', 10.0)
        if pd.isna(meta_exec): meta_exec = 10.0 # Margem de segurança
        
        if dias > (meta_exec * 2): return '🔴 Crítico (Execução)'
        elif dias > meta_exec:     return '🟡 Atrasado (Execução)'
        else:                      return '🟢 Dentro do Prazo'
        
    return '✔️ Concluído'

def carregar_e_processar_dados():
    collection_users, collection_tasks = connect_to_mongo()
    tabela = pd.DataFrame(list(collection_tasks.find()))    
    
    if tabela.empty:
        return tabela
    
    # 1. Tratamento de Datas (Usando createdAt do Mongoose)
    tabela['createdAt'] = pd.to_datetime(tabela.get('createdAt'), errors='coerce')
    tabela['data_inicio'] = pd.to_datetime(tabela.get('data_inicio'), errors='coerce')
    tabela['data_conclusao'] = pd.to_datetime(tabela.get('data_conclusao'), errors='coerce')

    # Data de hoje para cálculos ativos
    hoje = pd.Timestamp.now()

    # Tempo total de conclusão
    tabela['tempo_conclusao_dias'] = (tabela['data_conclusao'] - tabela['createdAt']).dt.days
    
    # 2. Lógica de Tempos (Backlog vs Execução) do seu Notebook
    tabela['duracao_em_dias'] = 0.0
    tabela['tempo_no_backlog'] = 0.0
    
    # Tempo na fila
    tabela['tempo_no_backlog'] = np.where(
        tabela['status_atual'] == 'pendente',
        (hoje - tabela['createdAt']).dt.days,
        (tabela['data_inicio'] - tabela['createdAt']).dt.days
    )
    
    # Tempo em execução
    task_concluida = tabela['status_atual'] == 'concluida'
    tabela.loc[task_concluida, 'duracao_em_dias'] = (tabela.loc[task_concluida, 'data_conclusao'] - tabela.loc[task_concluida, 'data_inicio']).dt.days
    
    task_andamento = tabela['status_atual'] == 'andamento'
    tabela.loc[task_andamento, 'duracao_em_dias'] = (hoje - tabela.loc[task_andamento, 'data_inicio']).dt.days

    # 3. Lógica Inteligente de Metas Baseada no Histórico
    historico_concluido = tabela[tabela['status_atual'] == 'concluida']
    meta_execucao_prioridade = historico_concluido.groupby('prioridade')['duracao_em_dias'].median().round(1)
    meta_backlog_prioridade = historico_concluido.groupby('prioridade')['tempo_no_backlog'].median().round(1)
    
    tabela['meta_execucao'] = tabela['prioridade'].map(meta_execucao_prioridade)
    tabela['meta_backlog'] = tabela['prioridade'].map(meta_backlog_prioridade)
    
    return tabela

@app.get("/metrics")
def obtener_metricas():
    tabela = carregar_e_processar_dados()
    
    if tabela.empty:
        return {"mensagem": "Sem dados"} # Retorno vazio seguro
    
    # --- MÉTRICAS GERAIS ---
    total_tarefas = int(tabela.shape[0])
    status_qtd = {para_camel_case(k): int(v) for k, v in tabela['status_atual'].value_counts().to_dict().items()}
    
    media_calc = tabela['tempo_conclusao_dias'].mean()
    tempo_medio = round(float(media_calc), 1) if pd.notna(media_calc) else 0.0
    
    # --- MENTORADOS ---
    if 'mentorado' in tabela.columns:
        tarefas_por_mentorado = tabela['mentorado'].dropna().value_counts().to_dict()
        ativas_por_mentorado = tabela[tabela['status_atual'].isin(['pendente', 'andamento'])]['mentorado'].dropna().value_counts().to_dict()
    else:
        tarefas_por_mentorado, ativas_por_mentorado = {}, {}

    # --- PAINEL DE DIAGNÓSTICO (A Grande Adição!) ---
    tabela_ativas = tabela[tabela['status_atual'].isin(['andamento', 'pendente'])].copy()
    
    painel_intervencao = []
    painel_fluxo = []
    
    if not tabela_ativas.empty:
        # Colunas dinâmicas de dias decorridos e metas
        tabela_ativas['dias_decorridos'] = np.where(
            tabela_ativas['status_atual'] == 'pendente',
            tabela_ativas['tempo_no_backlog'], 
            tabela_ativas['duracao_em_dias']
        )
        tabela_ativas['meta_dias'] = np.where(
            tabela_ativas['status_atual'] == 'pendente',
            tabela_ativas['meta_backlog'], 
            tabela_ativas['meta_execucao']
        )
        
        # Aplica a função de diagnóstico
        tabela_ativas['Diagnostico'] = tabela_ativas.apply(calcular_diagnostico_global, axis=1)
        
        # Seleciona apenas as colunas que importam para o Angular
        tabela_final = tabela_ativas[[
            'mentorado', 'titulo', 'area_atuacao', 'prioridade', 'status_atual', 
            'dias_decorridos', 'meta_dias', 'Diagnostico'
        ]].copy()
        
        # Substitui NaNs por None (para o JSON não quebrar)
        tabela_final = tabela_final.replace({np.nan: None})
        
        # Separa os painéis exatamente como você fez no Pandas!
        condicao_problema = tabela_final['Diagnostico'].str.contains('🔴|🟡', na=False)
        
        # Converte para listas de dicionários (O formato perfeito para o Frontend listar em tabelas)
        painel_intervencao = tabela_final[condicao_problema].sort_values(by='dias_decorridos', ascending=False).to_dict(orient='records')
        painel_fluxo = tabela_final[~condicao_problema].sort_values(by='dias_decorridos', ascending=False).to_dict(orient='records')

    # Retorno unificado de Ouro
    return {
        "resumoGeral": {
            "totalTarefas": total_tarefas,
            "status": status_qtd
        },
        "sLA": {
            "tempoMedioDias": tempo_medio,
        },
        "mentorados": {
            "totalTarefas": tarefas_por_mentorado,
            "tarefasAtivas": ativas_por_mentorado
        },
        "painelInteligente": {
            "totalCriticas": len(painel_intervencao),
            "intervencao": painel_intervencao,
            "fluxoSaudavel": painel_fluxo
        }
    }