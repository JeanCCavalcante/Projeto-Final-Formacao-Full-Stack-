# Projeto Final - Formação Full Stack - Inova.PCD


#### 📊 Projeto de Engenharia de Software com pipeline ETL em lote para Dashboard de tarefas e acompanhamento de produtividade, Inteligência e Relatórios.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura do Pipeline](#arquitetura-do-pipeline)
- [Dashboard](#dashboard)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Executar](#como-executar)
- [Contato](#contato)

---

## Sobre o Projeto

Este repositório mostra um fluxo ETL completo em batch usando dados reais de ...


O pipeline cobre as etapas de:

1. Extração dos dados CSV
2. Validação e tratamento de qualidade de dados
3. Transformação e criação de métricas
4. Agregações para análise
5. Visualização do Dashboard
   

Objetivo: Uma solução completa para gerenciamento de tarefas com foco em 
segurança, acessibilidade e análise de dados. 

---

## Arquitetura do Pipeline

![Arquitetura ETL em Batch](assets/arquitetura.png)

---

## Dashboard

### Visão Geral

![Dashboard - Visão Geral](assets/v1.jpg)

### Análise por Fornecedor

![Dashboard - Fornecedor](assets/v2.jpg)

### Análise por Pagamento

![Dashboard - Pagamento](assets/v3.jpg)

### Análise por Dia da Semana

![Dashboard - Dia da Semana](assets/v4.jpg)

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Front-end | HTML5 Semântico, CSS3 (Flexbox/Grid), JavaScript ES6. |
| Back-end  | Node.js, Express.js. |
| Banco de Dados | MongoDB (via Mongoose ODM). |
| Segurança |  JWT (JSON Web Token), Bcrypt.js. | 
| Dados  | Python 3, Pandas, Matplotlib, PyMongo. |

---

## Estrutura do Projeto

```text
├── frontend/ # Interface do Usuário(HTML5 Semântico, CSS3(Flexbox/Grid), JavaScript ES6) 
├── backend/  # API REST em Node.js
├── data_analysis/ # Scripts de análise em Python
└── docs/ # Documentação e prints do projeto

---

## Como Executar o Projeto

## 1) Pré-requisitos

- Node.js instalado
- Python 3.14 ou superior
- Conta no MongoDB Atlas (ou MongoDB Local)


### 2) Configuração do Back-end

1. Acesse a pasta /backend 
2. Instale as dependências: npm install
3. Crie um arquivo .env com sua MONGO_URI e JWT_SECRET
4. Inicie o servidor: npm run dev


### 3) Configuração do Front-end 

1. Acesse a pasta /frontend
2. Abra o arquivo login.html no seu navegador (ou use a extensão Live Server 
no VS Code)


### 4) Camada de Dados (Python) 

1. Acesse a pasta /data_analysis
2. Instale as bibliotecas: pip install pandas pymongo matplotlib python-dotenv
3. Execute o script: python analysis.py


```

---

## Insights Gerados 

O script de análise processa a base de dados para gerar o relatório 
report_produtividade.png, que apresenta: 

1. Distribuição de Status: Percentual de tarefas concluídas vs. pendentes.
2. Limpeza Automática: Remoção de entradas duplicadas ou nulas que 
possam comprometer a métrica de desempenho. 


## A Squad

1. Dev: [Laura] - Lead Back-end & Segurança
2. Dev: [Milenna] - Back-end & Banco de Dados
3. Dev: [Jessicah] - Lead Front-end & UI/UX 
4. Dev: [Ronny] - Front-end & Integração de API 
5. Dev: [Jean] - Data Science & Integração Python 

---
