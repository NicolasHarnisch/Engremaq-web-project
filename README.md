# Engremaq - Full Stack E-commerce para Peças de Tratores 🚜

> **Desafio Técnico Completo** — Plataforma B2B/B2C com Integração de Pagamentos (PIX, Boleto, Cartão) e Autenticação JWT

<div style="display: inline-block; margin-bottom: 15px;">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</div>

Plataforma de e-commerce completa desenvolvida em **arquitetura desacoplada (Client-Server)** para distribuição de peças agrícolas e tratores. O projeto implementa um fluxo de compra realista, autenticação segura com JWT + bcrypt, múltiplas formas de pagamento (PIX com QR Code, Boleto, Cartão de Crédito) e integração com Mercado Pago. Ideal para demostrar domínio de Full Stack, REST APIs, segurança de dados e UX/UI em e-commerce.

---

## � Índice

- [Engremaq - Full Stack E-commerce para Peças de Tratores 🚜](#engremaq---full-stack-e-commerce-para-peças-de-tratores-)
  - [� Índice](#-índice)
  - [🎯 Visão Geral](#-visão-geral)
    - [Principais Destaques:](#principais-destaques)
  - [🏗️ Arquitetura do Projeto](#️-arquitetura-do-projeto)
    - [Modelo Client-Server Desacoplado](#modelo-client-server-desacoplado)
  - [🛠️ Tecnologias \& Dependências](#️-tecnologias--dependências)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [📁 Estrutura de Pastas](#-estrutura-de-pastas)
  - [🚀 Setup \& Instalação](#-setup--instalação)
    - [Pré-requisitos](#pré-requisitos)
    - [Passo 1️⃣ — Clonar o Repositório](#passo-1️⃣--clonar-o-repositório)
    - [Passo 2️⃣ — Configurar Backend](#passo-2️⃣--configurar-backend)
    - [Passo 3️⃣ — Iniciar o Servidor Backend](#passo-3️⃣--iniciar-o-servidor-backend)
    - [Passo 4️⃣ — Configurar Frontend](#passo-4️⃣--configurar-frontend)
  - [🔐 Variáveis de Ambiente](#-variáveis-de-ambiente)
    - [🔑 Como Gerar Chaves Seguras](#-como-gerar-chaves-seguras)
  - [📡 API REST - Endpoints \& Documentação](#-api-rest---endpoints--documentação)
    - [Base URL](#base-url)
    - [🔐 Autenticação | `/auth/*`](#-autenticação--auth)
    - [🛍️ Produtos | `/produtos`](#️-produtos--produtos)
    - [📦 Pedidos | `/pedidos`](#-pedidos--pedidos)
    - [💳 Pagamentos | `/pagamento`](#-pagamentos--pagamento)
    - [🚚 Frete | `/frete`](#-frete--frete)
    - [📧 Contato | `/contatos`](#-contato--contatos)
  - [⭐ Features Implementadas](#-features-implementadas)
    - [🔑 Autenticação \& Segurança](#-autenticação--segurança)
    - [🛒 Carrinho \& Compra](#-carrinho--compra)
    - [📍 Endereço \& Frete](#-endereço--frete)
    - [💰 Pagamentos](#-pagamentos)
    - [📦 Pedidos](#-pedidos)
    - [📊 Dashboard](#-dashboard)
    - [🔍 Catálogo \& Busca](#-catálogo--busca)
    - [📧 Comunicação](#-comunicação)
  - [🛣️ Fluxo de Compra do Usuário](#️-fluxo-de-compra-do-usuário)
  - [🧠 Decisões Técnicas \& Trade-offs](#-decisões-técnicas--trade-offs)
    - [1. Arquitetura: MVC Desacoplado](#1-arquitetura-mvc-desacoplado)
    - [2. Frontend: Vanilla JS vs. React](#2-frontend-vanilla-js-vs-react)
    - [3. localStorage para Carrinho](#3-localstorage-para-carrinho)
    - [4. MongoDB (NoSQL)](#4-mongodb-nosql)
    - [5. JWT (Stateless)](#5-jwt-stateless)
  - [💡 Performance \& Otimizações](#-performance--otimizações)
    - [Frontend](#frontend-1)
    - [Backend](#backend-1)
  - [🧪 Testes (Preparado para Implementação)](#-testes-preparado-para-implementação)
    - [Backend](#backend-2)
    - [Frontend](#frontend-2)
  - [🚀 Deployment](#-deployment)
    - [Backend](#backend-3)
    - [Frontend](#frontend-3)
  - [📚 Recursos \& Referências](#-recursos--referências)
  - [📝 Padrões de Código](#-padrões-de-código)
    - [Controller](#controller)
    - [Fetch (Frontend)](#fetch-frontend)
  - [🤝 Como Contribuir](#-como-contribuir)
  - [🗺️ Roadmap \& Melhorias Futuras](#️-roadmap--melhorias-futuras)
    - [Curto Prazo (1-3 meses)](#curto-prazo-1-3-meses)
    - [Médio Prazo (3-6 meses)](#médio-prazo-3-6-meses)
    - [Longo Prazo (6+ meses)](#longo-prazo-6-meses)
  - [👨‍💻 Autor](#-autor)
  - [📞 Suporte](#-suporte)

---

## 🎯 Visão Geral

Este projeto demonstra **expertise full-stack** em desenvolvimento web moderno. A aplicação segue **princípios SOLID**, **separação de responsabilidades (MVC)** e **boas práticas em segurança**.

### Principais Destaques:
✅ **Autenticação Segura** — JWT + Tokens, Bcrypt, Verificação por Email  
✅ **Múltiplos Métodos de Pagamento** — PIX (QR Code), Boleto, Cartão de Crédito  
✅ **Dashboard do Usuário** — Histórico de pedidos, cancelamentos e aprovações  
✅ **Gestão de Carrinho** — Carrinho persistente com cálculo de frete dinâmico  
✅ **API RESTful Escalável** — Pronta para mobile apps, PWAs e integrações third-party  
✅ **Sem Frameworks Frontend** — Vanilla JS com domínio profundo de DOM, Fetch API e State Management  

---

## 🏗️ Arquitetura do Projeto

### Modelo Client-Server Desacoplado

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vanilla JS)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages/         → Views do usuário (13 páginas HTML) │   │
│  │  Assets/        → CSS e JS granulares por página     │   │
│  │  Fetch API      → Comunicação assíncrona c/ Backend  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
┌──────────────────────▼──────────────────────────────────────┐
│                 BACKEND (Node.js + Express)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes/        → Definição de endpoints da API     │   │
│  │  Controllers/   → Lógica de negócio                 │   │
│  │  Models/        → Schemas MongoDB (Mongoose)        │   │
│  │  Middleware     → Autenticação, CORS, Validação    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────────────┐
│                  DATABASE (MongoDB)                          │
│  Collections: Usuario, Produto, Pedido, Contato, ...       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias & Dependências

### Backend
| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Node.js** | v16+ | Runtime JavaScript |
| **Express.js** | 5.2.1 | Framework Web |
| **MongoDB** | 7.1.0 | Banco de dados NoSQL |
| **Mongoose** | 9.2.4 | ODM (Object Document Mapper) |
| **JWT** | 9.0.3 | Autenticação via tokens |
| **Bcrypt** | 6.0.0 | Hash de senhas |
| **Mercado Pago API** | 2.12.0 | Gateway de pagamentos |
| **QRCode** | 1.5.4 | Geração de QR Code para PIX |
| **Nodemailer** | 8.0.1 | Envio de emails (verificação, códigos) |
| **Axios** | 1.13.6 | HTTP Client |
| **CORS** | 2.8.6 | Controle de acesso cross-origin |
| **dotenv** | 17.3.1 | Gerenciamento de variáveis de ambiente |

### Frontend
- **HTML5** — Semântica e acessibilidade
- **CSS3** — Flexbox, Grid, Responsividade
- **Vanilla JavaScript (ES6+)** — Sem frameworks, código puro
- **Fetch API** — Comunicação com backend

---

## 📁 Estrutura de Pastas

```
Engremaq-web-project/
│
├── 📦 backend/                       # Node.js REST API
│   ├── src/
│   │   ├── 🔌 controllers/           # Lógica de negócio (6 controllers)
│   │   │   ├── AuthController.js      # Registrar, Login, Verificação, Alterações
│   │   │   ├── ProdutoController.js   # Listagem, Busca, Detalhes
│   │   │   ├── PedidoController.js    # Criar, Cancelar, Aprovar, Histórico
│   │   │   ├── PagamentoController.js # PIX, Boleto, Cartão, Processamento
│   │   │   ├── FreteController.js     # Cálculo dinâmico de frete
│   │   │   └── ContatoController.js   # Gerenciamento de mensagens
│   │   │
│   │   ├── 📊 models/                # Schemas MongoDB (Mongoose)
│   │   │   ├── Usuario.js             # {nome, email, cpf, telefone, senha, papel}
│   │   │   ├── Produto.js             # {codigo, nome, preco, estoque, categoria}
│   │   │   ├── Pedido.js              # {numero, items, status, total, data}
│   │   │   └── Contato.js             # {nome, email, assunto, mensagem, data}
│   │   │
│   │   ├── 🛣️ routes/                # Definição de endpoints (6 routers)
│   │   │   ├── authRoutes.js          # /api/auth/*
│   │   │   ├── produtoRoutes.js       # /api/produtos/*
│   │   │   ├── pedidoRoutes.js        # /api/pedidos/*
│   │   │   ├── pagamentoRoutes.js     # /api/pagamento/*
│   │   │   ├── freteRoutes.js         # /api/frete/*
│   │   │   └── contatoRoutes.js       # /api/contatos/*
│   │   │
│   │   └── 🚀 server.js              # Inicialização da aplicação, middlewares
│   │
│   ├── package.json                  # Dependências + Scripts
│   └── .env.example                  # Template de variáveis de ambiente
│
├── 🎨 frontend/                      # Aplicação Web Vanilla JS + HTML/CSS
│   ├── 📄 index.html                 # Página inicial (Home)
│   │
│   ├── 📁 Pages/                     # 11 páginas HTML (views)
│   │   ├── Index.html                # ⭐ Home (listagem principal)
│   │   ├── About.html                # Informações sobre a empresa
│   │   ├── Contact.html              # Formulário de contato
│   │   ├── Products.html             # Catálogo de produtos com filtros
│   │   ├── ProductDetail.html        # Detalhes completos do produto
│   │   ├── Cart.html                 # Carrinho de compras persistente
│   │   ├── Address.html              # Endereço de entrega (múltiplos)
│   │   ├── Payment.html              # Seleção do método de pagamento
│   │   ├── Revision.html             # Revisão final do pedido
│   │   ├── Conclude.html             # Confirmação (sucesso/erro)
│   │   ├── Login.html                # Login de usuário existente
│   │   ├── Register.html             # Cadastro de novo usuário
│   │   └── Dashboard.html            # Painel do usuário (pedidos, conta)
│   │
│   ├── 📁 Assets/
│   │   │
│   │   ├── 🎨 Css/                   # Estilos granulares (um por página)
│   │   │   ├── Global.css            # Estilos compartilhados
│   │   │   ├── Style Index.css       # Homepage
│   │   │   ├── Style About.css       # Sobre
│   │   │   ├── Style Products.css    # Catálogo
│   │   │   ├── Style ProductDetail.css
│   │   │   ├── Style Cart.css        # Carrinho
│   │   │   ├── Style Address.css     # Endereço
│   │   │   ├── Style Payment.css     # Pagamento
│   │   │   ├── Style Revision.css    # Revisão
│   │   │   ├── Style Conclude.css    # Conclusão
│   │   │   ├── Style Login.css       # Login
│   │   │   ├── Style Register.css    # Registro
│   │   │   ├── Style Dashboard.css   # Dashboard
│   │   │   ├── Style Contact.css     # Contato
│   │   │   └── Style Search.css      # Busca
│   │   │
│   │   ├── 🖼️ Images/               # Assets (logo, imagens de produtos)
│   │   │
│   │   └── ⚙️ Js/                   # Scripts granulares (um por página)
│   │       ├── global.js             # Funções compartilhadas
│   │       ├── index.js              # Homepage
│   │       ├── products.js           # Catálogo
│   │       ├── productDetail.js      # Detalhes
│   │       ├── cart.js               # Carrinho (persistência localStorage)
│   │       ├── address.js            # Endereço (validação, múltiplos)
│   │       ├── payment.js            # Pagamento (PIX, Boleto, Cartão)
│   │       ├── revision.js           # Revisão final
│   │       ├── conclude.js           # Conclusão
│   │       ├── login.js              # Autenticação
│   │       ├── register.js           # Cadastro
│   │       ├── dashboard.js          # Histórico de pedidos
│   │       └── contact.js            # Envio de mensagens
│   │
│   └── favicon.ico                   # Ícone do navegador
│
├── 📄 README.md                      # Documentação completa
├── 📄 License                        # MIT License
└── package.json                      # Root dependencies (se houver)
```

---

## 🚀 Setup & Instalação

### Pré-requisitos
- **Node.js** (v16+) — [Baixar aqui](https://nodejs.org/)
- **npm** ou **yarn** — Gerenciador de pacotes
- **MongoDB** — [Local](https://www.mongodb.com/try/download/community) ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (nuvem)
- **Code Editor** — VS Code recomendado

### Passo 1️⃣ — Clonar o Repositório

```bash
git clone https://github.com/NicolasHarnisch/Engremaq-web-project.git
cd Engremaq-web-project
```

### Passo 2️⃣ — Configurar Backend

```bash
cd backend
npm install
```

Após instalar as dependências, crie um arquivo `.env` na raiz da pasta `backend/`:

```bash
cp .env.example .env  # (ou crie manualmente)
```

Preencha as variáveis de ambiente (veja seção abaixo).

### Passo 3️⃣ — Iniciar o Servidor Backend

```bash
npm start
# ou para desenvolvimento com auto-reload (se tiver nodemon instalado):
npm run dev
```

O servidor estará disponível em: **http://localhost:3000**

Para verificar se está funcionando: `curl http://localhost:3000/api/status`

### Passo 4️⃣ — Configurar Frontend

Existem 3 formas de rodar o frontend:

**Opção A) — Live Server do VS Code** (Recomendado)
1. Abra a pasta `frontend` no VS Code
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"
4. Abrirá em `http://localhost:5500`

**Opção B) — Servidor Python** (Se tiver Python instalado)
```bash
cd frontend
python -m http.server 8000
# Acesse: http://localhost:8000
```

**Opção C) — Servidor Node.js Simples**
```bash
cd frontend
npx http-server
# Acesse: http://localhost:8080
```

**Opção D) — Abrir diretamente no navegador**
```bash
# No Windows (abrir frontend/index.html)
start frontend/index.html

# No macOS
open frontend/index.html

# No Linux
xdg-open frontend/index.html
```

✅ **Pronto!** Seu projeto está rodando. Acesse:
- Frontend: `http://localhost:5500`
- Backend: `http://localhost:3000`
- API Status: `http://localhost:3000/api/status`

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
# ============================================
# SERVIDOR
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# BANCO DE DADOS (MongoDB)
# ============================================
MONGODB_URI=mongodb://localhost:27017/engremaq
# OU para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:senha@cluster0.mongodb.net/engremaq

# ============================================
# AUTENTICAÇÃO (JWT)
# ============================================
JWT_SECRET=sua_chave_secreta_super_segura_aqui_min_32_caracteres
JWT_EXPIRATION=7d

# ============================================
# EMAIL (Nodemailer - Gmail)
# ============================================
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app_google  # NÃO use sua senha normal! Use "Senha de App"
EMAIL_FROM=noreply@engremaq.com.br

# ============================================
# PAGAMENTOS (Mercado Pago)
# ============================================
MERCADOPAGO_ACCESS_TOKEN=seu_token_mercado_pago_aqui

# ============================================
# PIX (Exemplo - usar dados reais)
# ============================================
PIX_CHAVE=seu_email_ou_cpf ou celular@gmail.com
PIX_NOME=Nome Completo (Engremaq)
PIX_CIDADE=Fortaleza

# ============================================
# CORS (URLs permitidas)
# ============================================
CORS_ORIGIN=http://localhost:5500,http://localhost:8000,http://localhost:3000
```

### 🔑 Como Gerar Chaves Seguras

**JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Senha de App Google (Gmail):**
1. Acesse [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Gere uma nova "Senha de App" para Mail
3. Use essa senha (não a senha da conta Gmail)

---

## 📡 API REST - Endpoints & Documentação

### Base URL
```
http://localhost:3000/api
```

### 🔐 Autenticação | `/auth/*`

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| **POST** | `/auth/registrar` | Cadastro novo usuário | `{nome, email, cpf, telefone, senha}` |
| **POST** | `/auth/login` | Login | `{email, senha}` |
| **POST** | `/auth/solicitar-codigo` | Código de verificação | `{email}` |
| **POST** | `/auth/verificar-codigo` | Verificar código | `{email, codigo}` |
| **POST** | `/auth/alterar-email` | Alterar email | `{emailAnterior, emailNovo, senha}` |
| **POST** | `/auth/alterar-senha` | Alterar senha | `{email, senhaAtual, senhaNova}` |
| **POST** | `/auth/confirmar-exclusao` | Deletar conta | `{email, codigo}` |

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","senha":"123456"}'
```

---

### 🛍️ Produtos | `/produtos`

| Método | Endpoint | Descrição | Params |
|--------|----------|-----------|--------|
| **GET** | `/produtos` | Listar todos | `?categoria=&busca=&pagina=1&limite=20` |
| **GET** | `/produtos/:id` | Detalhes | — |
| **GET** | `/produtos/buscar/:nome` | Buscar por nome | — |
| **GET** | `/categorias` | Listar categorias | — |

---

### 📦 Pedidos | `/pedidos`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **POST** | `/pedidos/criar` | Criar novo pedido |
| **GET** | `/pedidos/:usuarioId` | Listar pedidos do usuário |
| **GET** | `/pedidos/:numero/detalhes` | Detalhes de 1 pedido |
| **PUT** | `/pedidos/:numero/cancelar` | Cancelar |
| **PUT** | `/pedidos/:numero/aprovar` | Aprovar (admin) |

---

### 💳 Pagamentos | `/pagamento`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **POST** | `/pagamento/gerar` | Gerar (PIX/Boleto/Cartão) |
| **POST** | `/pagamento/checkout` | Processar pagamento |
| **GET** | `/pagamento/:pedidoId/status` | Status |

**Métodos:** `pix`, `boleto`, `cartao`

---

### 🚚 Frete | `/frete`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **POST** | `/frete/calcular` | Calcular |
| **GET** | `/frete/opcoes` | Opções de entrega |

---

### 📧 Contato | `/contatos`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **POST** | `/contatos` | Enviar mensagem |
| **GET** | `/contatos/:id` | Obter mensagem |

---

## ⭐ Features Implementadas

### 🔑 Autenticação & Segurança
- ✅ Registro com validação (email, CPF, telefone)
- ✅ Login com JWT (tokens com expiração)
- ✅ Hashing com Bcrypt (10+ rounds)
- ✅ Verificação por código (2FA)
- ✅ Alterar email/senha
- ✅ Exclusão de conta com confirmação
- ✅ CORS configurável
- ✅ Preparado para rate limiting

### 🛒 Carrinho & Compra
- ✅ Persistência com localStorage
- ✅ Adicionar/remover produtos
- ✅ Ajuste de quantidade
- ✅ Cálculo real-time de subtotal
- ✅ Sincronização com backend

### 📍 Endereço & Frete
- ✅ Múltiplos endereços por usuário
- ✅ Validação de CEP
- ✅ Cálculo dinâmico de frete
- ✅ Múltiplas transportadoras (Sedex, PAC)
- ✅ Estimativa de prazo

### 💰 Pagamentos
- ✅ **PIX** — QR Code gerado dinamicamente
- ✅ **Boleto** — Via Mercado Pago
- ✅ **Cartão** — Processamento seguro
- ✅ Validação de dados de pagamento
- ✅ Confirmação de transação
- ✅ Histórico de pagamentos

### 📦 Pedidos
- ✅ Criação com número único
- ✅ Histórico por usuário
- ✅ Cancelamento de pedido
- ✅ Aprovação (admin)
- ✅ Rastreamento de status
- ✅ Detalhamentos (itens, total, frete)

### 📊 Dashboard
- ✅ Visualizar perfil completo
- ✅ Histórico de pedidos
- ✅ Detalhes de cada pedido
- ✅ Cancelar pedidos
- ✅ Redefinir dados pessoais

### 🔍 Catálogo & Busca
- ✅ Listagem com filtros
- ✅ Busca por nome/código
- ✅ Filtro por categoria
- ✅ Paginação eficiente
- ✅ Detalhes técnicos do produto
- ✅ Imagens responsivas

### 📧 Comunicação
- ✅ Formulário de contato
- ✅ Envio de emails (Nodemailer)
- ✅ Notificações de pedido
- ✅ Verificação de email

---

## 🛣️ Fluxo de Compra do Usuário

```
HOME
  ↓
PRODUTOS (Busca, Filtro)
  ↓
DETALHE DO PRODUTO
  ↓
CARRINHO (Revisar itens)
  ↓
LOGIN / REGISTRO (Autenticação)
  ↓
ENDEREÇO (Validar, múltiplos)
  ↓
FRETE (Selecionar transportadora)
  ↓
PAGAMENTO (PIX, Boleto, Cartão)
  ↓
REVISÃO (Confirmar dados)
  ↓
CONCLUSÃO (Sucesso/Erro)
  ↓
DASHBOARD (Histórico)
```

---

## 🧠 Decisões Técnicas & Trade-offs

### 1. Arquitetura: MVC Desacoplado

**Decisão:** Separação total entre Frontend e Backend

**Benefícios:**
- 📈 Escalabilidade independente
- 🔄 API reutilizável (Mobile, PWA)
- 🛠️ Equipes trabalham em paralelo
- 🌐 API-First Design

### 2. Frontend: Vanilla JS vs. React

**Decisão:** JavaScript puro (ES6+)

**Benefícios:**
- 🧠 Domínio profundo de fundamentos
- ⚡ Zero overhead, bundle pequeno
- 🎓 Portabilidade sem lock-in
- 🔍 Código mais legível

### 3. localStorage para Carrinho

**Decisão:** localStorage + sincronização com backend

**Benefícios:**
- ⚡ Rápido (sem HTTP a cada produto)
- 📴 Funciona offline
- 💾 Persiste através de refreshes
- 🔒 Backend valida no checkout

### 4. MongoDB (NoSQL)

**Decisão:** NoSQL para flexibilidade

**Benefícios:**
- 🔄 Flexibilidade de schema
- 📦 JSON nativo
- ⚡ Rápido para prototipagem
- 🌍 Escalabilidade horizontal

### 5. JWT (Stateless)

**Decisão:** JSON Web Tokens

**Benefícios:**
- 🔓 Sem estado no servidor
- 📱 Mobile-friendly
- 🛡️ Seguro (assinado)
- ⚡ Ideal para APIs distribuídas

---

## 💡 Performance & Otimizações

### Frontend
- 🎯 **CSS Granular** — CSS por página
- ⚡ **Lazy Loading** — Imagens sob demanda
- 🔄 **Fetch com timeout** — Evita requisições penduradas
- 📦 **Minificação** — Em produção

### Backend
- 📊 **Mongoose Indexes** — Índices em campos frequentes
- 🚀 **Paginação** — 20 itens por vez
- 💾 **Caching** — Redis para produtos
- 🔐 **Rate Limiting** — Brute force protection
- 🗜️ **GZIP** — Compressão de respostas

---

## 🧪 Testes (Preparado para Implementação)

### Backend
```bash
npm install --save-dev jest supertest
```

Testes para: Autenticação, Validação, Frete, Pedidos, Pagamentos

### Frontend
```bash
npm install --save-dev vitest @testing-library/dom
```

Testes para: Carrinho, Formulários, APIs (mocks)

---

## 🚀 Deployment

### Backend

**Railway / Render / Fly.io:**
```
1. Criar conta
2. Conectar GitHub
3. Variáveis de ambiente
4. Deploy automático
```

**DigitalOcean / AWS:**
```
1. Criar droplet/instância
2. Instalar Node.js
3. PM2 para auto-restart
```

### Frontend

**Vercel:**
```bash
npm install -g vercel
vercel frontend/
```

**Netlify:** Conectar repo + configurar

**GitHub Pages:** Branch gh-pages

---

## 📚 Recursos & Referências

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Mercado Pago](https://developers.mercadopago.com/)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [OWASP](https://owasp.org/)

---

## 📝 Padrões de Código

### Controller
```javascript
exports.criar = async (req, res) => {
  try {
    const dados = req.body;
    if (!dados.email) {
      return res.status(400).json({ sucesso: false, erro: "Email obrigatório" });
    }
    const resultado = await Model.create(dados);
    res.status(201).json({ sucesso: true, data: resultado });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
};
```

### Fetch (Frontend)
```javascript
async function buscarProdutos(filtros = {}) {
  try {
    const params = new URLSearchParams(filtros);
    const resposta = await fetch(`/api/produtos?${params}`);
    if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);
    return await resposta.json();
  } catch (erro) {
    console.error("Erro:", erro);
    mostrarErro("Falha ao carregar.");
  }
}
```

---

## 🤝 Como Contribuir

1. Fork o repositório
2. `git checkout -b feature/MinhaFeature`
3. `git commit -m 'Adicionar MinhaFeature'`
4. `git push origin feature/MinhaFeature`
5. Abra Pull Request

**Padrões:** Prettier (2 spaces), testes, commits claros

---

## 🗺️ Roadmap & Melhorias Futuras

### Curto Prazo (1-3 meses)
- [ ] Testes (Jest, Vitest)
- [ ] Rate limiting
- [ ] Avaliações de produtos (⭐)
- [ ] Wishlist/Favoritos
- [ ] Live chat
- [ ] Notificações (SMS/Email)

### Médio Prazo (3-6 meses)
- [ ] Dashboard admin
- [ ] Cupons/promoções
- [ ] Google Analytics
- [ ] PWA (offline)
- [ ] Redis caching
- [ ] Testes E2E

### Longo Prazo (6+ meses)
- [ ] App Mobile
- [ ] Marketplace
- [ ] Programa de afiliados
- [ ] Integração ERP
- [ ] Machine Learning
- [ ] Multilíngue (i18n)
- [ ] CI/CD (GitHub Actions)

---

## 👨‍💻 Autor

**Nicolas Harnisch**

- 🐙 GitHub: [@NicolasHarnisch](https://github.com/NicolasHarnisch)
- 💼 LinkedIn: [LinkedIn](https://linkedin.com/in/nicolasharnisch)

---

## 📞 Suporte

- 🐛 Issues: [GitHub Issues](https://github.com/NicolasHarnisch/Engremaq-web-project/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/NicolasHarnisch/Engremaq-web-project/discussions)

---


**Obrigado por visitar! ⭐ Se gostou, deixe uma estrela no GitHub!**