from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import re

from canexao import connect_to_mongo

app = FastAPI(title="API de Métricas da Mentoria")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔄 Função auxiliar para converter qualquer string para camelCase automaticamente
def para_camel_case(texto):
    if not isinstance(texto, str):
        return texto
    # Remove hífens, barras ou caracteres especiais comuns e separa por espaços
    palavras = re.sub(r'[-_/\s]+', ' ', texto).strip().split()
    if not palavras:
        return ""
    # Junta as palavras: a primeira fica toda minúscula, as seguintes com a primeira letra maiúscula
    return palavras[0].lower() + "".join(p.capitalize() for p in palavras[1:])

def carregar_e_processar_dados():
    collection_users, collection_tasks = connect_to_mongo()

    # Transforma os dados reais do banco em uma tabela do Pandas
    tabela = pd.DataFrame(list(collection_tasks.find()))    
    
    
    tabela['data_criacao'] = pd.to_datetime(tabela['data_criacao'], errors='coerce')
    tabela['data_conclusao'] = pd.to_datetime(tabela['data_conclusao'], errors='coerce')
    tabela['tempo_conclusao_dias'] = (tabela['data_conclusao'] - tabela['data_criacao']).dt.days
    
    return tabela

@app.get("/metrics")
def obtener_metricas():
    tabela = carregar_e_processar_dados()
    
    # 1. Métricas Gerais
    total_tarefas = int(tabela.shape[0])
    
    # Convertendo as chaves do status para camelCase (ex: 'andamento' continua igual, 'em_espera' -> 'emEspera')
    status_qtd = {para_camel_case(k): int(v) for k, v in tabela['status_atual'].value_counts().to_dict().items()}
    
    # 2. Métricas de Tempo
    tempo_medio = float(tabela['tempo_conclusao_dias'].mean())
    tempo_mediana = float(tabela['tempo_conclusao_dias'].median())
    
    # 3. Gargalos por Área (Convertendo o nome das áreas internas para camelCase)
    pendentes_cru = tabela[tabela['data_conclusao'].isna()]['area_atuacao'].value_counts().to_dict()
    pendentes_por_area = {para_camel_case(k): int(v) for k, v in pendentes_cru.items()}
    
    # 4. Tempo médio por Área (Convertendo o nome das áreas internas para camelCase)
    tempo_por_area_cru = tabela.groupby('area_atuacao')['tempo_conclusao_dias'].mean().dropna().to_dict()
    tempo_por_area = {para_camel_case(k): round(float(v), 1) for k, v in tempo_por_area_cru.items()}

    # Retorno 100% padronizado em camelCase externo e interno
    return {
        "resumoGeral": {
            "totalTarefas": total_tarefas,
            "status": status_qtd
        },
        "sLA": {
            "tempoMedioDias": round(tempo_medio, 1),
            "tempoMedianaDias": round(tempo_mediana, 1)
        },
        "gargalos": {
            "tarefasPendentesPorArea": pendentes_por_area,
            "tempoMedioConclusaoPorArea": tempo_por_area
        }
    }