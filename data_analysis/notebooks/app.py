import streamlit as st
import json
import pandas as pd
import plotly.express as px

# 1. Configuração da Página Web
st.set_page_config(page_title="Dashboard de Performance", layout="wide")

# 2. Carregar os Dados do JSON
with open('dashboard_ana_ribeiro_completo.json', 'r', encoding='utf-8') as f:
    dados = json.load(f)

st.title("📊 Painel de Controle de Performance e Mentorias")
st.markdown("---")

# 3. Criar as Abas para Separar os Dois Dashboards
aba_equipe, aba_individual = st.tabs(["🌐 Visão Executiva (Equipe)", "👤 Visão Individual (Ana Ribeiro)"])

# ==========================================================
# DASHBOARD 1: VISÃO DA EQUIPE (MACRO)
# ==========================================================
with aba_equipe:
    st.header("Análise Macro da Operação")
    
    # KPIs da Equipe
    equipe_cards = dados["visao_geral_equipe"]["cards"]
    col1, col2, col3 = st.columns(3)
    col1.metric("Tempo Médio de Execução", f"{equipe_cards['tempo_medio_execucao_geral_dias']} dias")
    col2.metric("Mediana de Entrega", f"{equipe_cards['mediana_tempo_geral_dias']} dias")
    col3.metric("Gargalo Máximo", f"{equipe_cards['tarefa_mais_demorada_equipe_dias']} dias", delta="Crítico", delta_color="inverse")
    
    st.markdown("---")
    
    # Gráficos da Equipe (Lado a Lado)
    col_pizza, col_barra = st.columns([1, 1])
    
    with col_pizza:
        st.subheader("Distribuição de Status Geral")
        df_pizza_eq = pd.DataFrame(dados["visao_geral_equipe"]["grafico_pizza_status_geral"])
        fig_p_eq = px.pie(df_pizza_eq, values='quantidade', names='status', 
                          color='status', color_discrete_map={'concluida': '#2f855a', 'andamento': '#dd6b20', 'pendente': '#e53e3e'})
        st.plotly_chart(fig_p_eq, use_container_width=True)
        
    with col_barra:
        st.subheader("Gargalos Ativos por Área")
        df_gargalos = pd.DataFrame(dados["visao_geral_equipe"]["grafico_gargalos_por_area"])
        fig_bar = px.bar(df_gargalos, x='quantidade_tarefas_ativas', y='area', orientation='h',
                         labels={'quantidade_tarefas_ativas': 'Tarefas Ativas', 'area': 'Área'},
                         color_discrete_sequence=['#3182ce'])
        st.plotly_chart(fig_bar, use_container_width=True)

# ==========================================================
# DASHBOARD 2: VISÃO INDIVIDUAL (MICRO)
# ==========================================================
with aba_individual:
    st.header("Performance Individual: Ana Ribeiro")
    
    # KPIs Individuais
    ana_cards = dados["visao_individual_mentorada"]["cards"]
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Total Atividades", ana_cards["total_atividades_submetidas"])
    c2.metric("Tempo Médio Entrega", f"{ana_cards['tempo_medio_conclusao_dias']} dias", delta="Acima da Média", delta_color="inverse")
    c3.metric("Foco Atual (WIP)", ana_cards["atividades_em_andamento_atual"])
    c4.metric("Tempo de Fila (Backlog)", f"{ana_cards['tempo_backlog_mediana_dias']} dias", delta="Excelente", delta_color="normal")
    
    st.markdown("---")
    
    # Gráfico Dinâmico de Sprints
    st.subheader("Curva de Evolução por Sprint vs Média da Equipe")
    evolucao = dados["visao_individual_mentorada"]["grafico_evolucao_sprints"]
    df_pontos = pd.DataFrame(evolucao["pontos_grafico"])
    media_eq = evolucao["media_geral_equipe_dias"]
    
    mapa_cores = {'alta': '#E74C3C', 'media': '#F39C12', 'baixa': '#2ECC71'}
    fig_scatter = px.scatter(df_pontos, x='sprint', y='dias_gastos', color='prioridade',
                             hover_data=['titulo_tarefa'], color_discrete_map=mapa_cores,
                             labels={'dias_gastos': 'Dias Gastos', 'sprint': 'Sprint'})
    fig_scatter.add_hline(y=media_eq, line_dash="dash", line_color="gray", annotation_text=f"Média Equipe ({media_eq}d)")
    st.plotly_chart(fig_scatter, use_container_width=True)
    
    st.markdown("---")
    
    # Tabelas de SLA com Emojis
    st.subheader("📋 Painel de Controle de Prazos (SLA)")
    
    st.error("🚨 Bloco de Intervenção: Tarefas Críticas / Atrasadas")
    df_criticas = pd.DataFrame(dados["visao_individual_mentorada"]["tabela_atividades_criticas"])
    if not df_criticas.empty:
        st.dataframe(df_criticas[['titulo', 'prioridade', 'status_atual', 'duracao_em_dias', 'meta_dias', 'Diagnostico']], use_container_width=True)
    else:
        st.success("Nenhuma tarefa crítica encontrada!")
        
    st.success("🟢 Bloco Saudável: Fluxo sob Controle")
    df_saudaveis = pd.DataFrame(dados["visao_individual_mentorada"]["tabela_atividades_saudaveis"])
    if not df_saudaveis.empty:
        st.dataframe(df_saudaveis[['titulo', 'prioridade', 'status_atual', 'duracao_em_dias', 'meta_dias', 'Diagnostico']], use_container_width=True)