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

---

## Sobre o Projeto

Este repositório mostra um fluxo ETL completo em batch usando dados reais de ...

O pipeline cobre as etapas de:

1. Extração dos dados CSV
2. Validação e tratamento de qualidade de dados
3. Transformação e criação de métricas
4. Agregações para análise
5. Visualização no Angular
   
Objetivo: Uma solução completa para gerenciamento de tarefas com foco em segurança, acessibilidade e análise de dados. 

---

## Arquitetura do Pipeline

<img width="3200" height="1100" alt="Image" src="https://github.com/user-attachments/assets/9350511e-cc7c-4b2b-89d8-089570fada60" />

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
| :--- | :--- |
| Front-end | HTML5 Semântico, CSS3, JavaScript ES6, Angular. |
| Back-end | Node.js, Express.js. |
| Banco de Dados | MongoDB (via Mongoose ODM). |
| Segurança | JWT (JSON Web Token), Bcrypt.js. | 
| Dados | Python 3, Pandas, Matplotlib, PyMongo. |

---

## Estrutura do Projeto

```text
├── frontend/      # Interface do Usuário(HTML5 Semântico, CSS3(Flexbox/Grid), JavaScript ES6) 
├── backend/       # API REST em Node.js
├── data_analysis/ # Scripts de análise em Python
└── docs/          # Documentação e prints do projeto

````
---

## Pré-requisitos

| Ferramenta | Versão minima | Por que usamos |
| :--- | :--- | :--- |
| Python | 3.14+ | Linguagem principal para construir o ETL e o dashboard. |
| Angular | v22 | Cria o dashboard interativo. |
| Biblioteca Python Pandas| 2.2+ | Faz limpeza, transformação, agregações e análise tabular dos dados. |
| Biblioteca Python Matplotlib.pyplot | 3.9.x | Permiti criar, personalizar e exibir gráficos e visualizações de dados de forma simples e direta. |
| Node.js | 18.x | Processa milhares de requisições simultâneas de forma rápida usando poucos recursos de hardware. |
| MongoDB | 6.x(local) ou conta no MongoDB Atlas | Serve para armazenar, gerenciar e recuperar grandes volumes de dados. |
| Git | qualquer | Controle de verção. |

---

## Instalação e configuração

### 1) Clonar o repositório

      git clone <url-do-repo>
      cd Projeto-Final-Formacao-Full-Stack

### 2) Instalar dependências

      npm install

### 3) Configurar variáveis de ambiente

Copie o template e preencha com seus valores:

    cp .env.env

Edite o .env (ver Variaveis de ambiente).
    
### 4) Criar o banco no Atlas

1. Crie um cluster gratuito em https://www.mongodb.com/cloud/atlas
2. Crie um usuário de banco (Database Access)
3. Libere seu IP em Network Access (0.0.0.0/0 para dev)
4. Copie a connection string e cole em MONGO_URI
      
---

## Como Executar o Projeto

### 1) Pré-requisitos

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

---

## Como Executar

### Modo desenvolvimento (com auto-reload)

      npm run dev

### Modo produção

      npm start

### Em ambos os casos, o servidor:

1. Conecta no MongoDB (mensagem 🍃 MongoDB Conectado com sucesso no console)
2. Sobe o Express na porta configurada
3. Tenta abrir http://localhost:5000 no navegador automaticamente

---

## A Squad

1. Dev: [Ronny] - Lead Back-end & Segurança
2. Dev: [Laura] - Lead Data & Integração MongoDB
3. Dev: [Jessicah] - Lead Front-end & UI/UX 
4. Dev: [Milenna] - Back-end (CRUD) & API 
5. Dev: [Jean] - Data Science 

---
