# Engremaq - Plataforma E-Commerce Empresarial para Peças Agrícolas 🚜

> **Solução Full Stack Pronta para Produção** — Plataforma B2B/B2C com Integração Segura de Pagamentos (PIX, Boleto, Cartão), Autenticação JWT & Gestão de Pedidos em Tempo Real

<div style="display: inline-block; margin-bottom: 15px;">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/REST_API-FF6C37?style=for-the-badge&logo=rest&logoColor=white" alt="REST API" />
</div>

**Engremaq** é uma plataforma de e-commerce completa e pronta para produção, construída com **arquitetura desacoplada (Client-Server)** para distribuição de peças de equipamentos agrícolas e componentes de tratores. Este projeto abrangente demonstra desenvolvimento Full Stack de nível empresarial, incluindo autenticação JWT segura com bcrypt, múltiplos métodos de pagamento (PIX com geração de QR Code, Boleto, Cartão de Crédito), integração com Mercado Pago, gestão de inventário em tempo real e dashboard profissional para usuários.

Perfeito para demonstrar expertise em design de API REST, boas práticas de cibersegurança, arquitetura de banco de dados escalável, UX/UI responsiva e estratégias de deployment pronto para nuvem.

> 📚 **Documentação Disponível Em:** 🇧🇷 Português (este arquivo) | [🇺🇸 English](README.md)

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Tecnologias & Dependências](#️-tecnologias--dependências)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Setup & Instalação](#-setup--instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [API REST - Endpoints & Documentação](#-api-rest---endpoints--documentação)
- [Features Implementadas](#-features-implementadas)
- [Fluxo de Compra do Usuário](#️-fluxo-de-compra-do-usuário)
- [Decisões Técnicas & Trade-offs](#-decisões-técnicas--trade-offs)
- [Performance & Otimizações](#-performance--otimizações)
- [Testes](#-testes)
- [Deployment](#-deployment)
- [Recursos & Referências](#-recursos--referências)
- [Padrões de Código](#-padrões-de-código)
- [Como Contribuir](#-como-contribuir)
- [Roadmap & Melhorias Futuras](#️-roadmap--melhorias-futuras)
- [Autor](#-autor)

---

## 🎯 Visão Geral

Este projeto demonstra **expertise full-stack** em desenvolvimento web moderno. A aplicação segue **princípios SOLID**, **separação de responsabilidades (MVC)** e **boas práticas em segurança de dados**.

### ✨ Principais Destaques:
✅ **Autenticação Segura** — JWT + Tokens, Bcrypt com 10+ rounds, 2FA por Email  
✅ **Múltiplos Métodos de Pagamento** — PIX (QR Code Dinâmico), Boleto, Cartão de Crédito  
✅ **Dashboard Completo** — Histórico de pedidos, cancelamentos, aprovações e gerenciamento de conta  
✅ **Gestão de Carrinho Inteligente** — Carrinho persistente com cálculo dinâmico de frete  
✅ **API RESTful Extensível** — Pronta para integração com apps mobile, PWAs e terceiros  
✅ **Frontend Vanilla JS** — JavaScript puro sem frameworks desnecessários, DOM avançado e State Management  

---

## 🏗️ Arquitetura do Projeto

### Modelo Client-Server Desacoplado

```
┌──────────────────────────────────────────────────────────────────┐
│              FRONTEND (Vanilla JavaScript + HTML5/CSS3)           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Pages/         → 13 páginas HTML responsivas              │  │
│  │  Assets/        → CSS e JS granulares (um por página)      │  │
│  │  Fetch API      → Comunicação assíncrona com backend       │  │
│  │  localStorage   → Persistência de carrinho & dados         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTP/HTTPS + JSON
┌──────────────────────▼───────────────────────────────────────────┐
│            BACKEND (Node.js + Express.js)                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Routes/        → Definição de endpoints RESTful           │  │
│  │  Controllers/   → Lógica de negócio separada               │  │
│  │  Models/        → Schemas MongoDB com Mongoose             │  │
│  │  Middleware     → Autenticação JWT, CORS, Validação       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼───────────────────────────────────────────┐
│                  DATABASE (MongoDB)                               │
│  Collections: Usuario, Produto, Pedido, Pagamento, Contato      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias & Dependências

### Backend (Node.js + Express)
| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Node.js** | v16+ | Runtime JavaScript |
| **Express.js** | 5.2.1 | Framework Web HTTP |
| **MongoDB** | 7.1.0 | Banco de dados NoSQL escalável |
| **Mongoose** | 9.2.4 | ODM para MongoDB |
| **JWT** | 9.0.3 | Autenticação com tokens |
| **Bcrypt** | 6.0.0 | Hash seguro de senhas |
| **Mercado Pago API** | 2.12.0 | Gateway de pagamentos |
| **QRCode** | 1.5.4 | Geração de QR Code para PIX |
| **Nodemailer** | 8.0.1 | Envio de emails transacionais |
| **Axios** | 1.13.6 | HTTP Client |
| **CORS** | 2.8.6 | Controle de acesso cross-origin |
| **dotenv** | 17.3.1 | Gerenciamento seguro de variáveis |

### Frontend (HTML5 + CSS3 + Vanilla JS)
- **HTML5** — Semântica, acessibilidade e SEO
- **CSS3** — Flexbox, Grid, Media Queries, Animações
- **JavaScript ES6+** — Assincronismo, Classes, Arrow Functions
- **Fetch API** — Requisições HTTP assíncronas

---

## 📁 Estrutura de Pastas

```
Engremaq-web-project/
│
├── 📦 backend/                       # Node.js REST API
│   ├── src/
│   │   ├── 🔌 controllers/           # Lógica de negócio (6 controllers)
│   │   │   ├── AuthController.js      # Registrar, Login, 2FA, Alterações
│   │   │   ├── ProdutoController.js   # CRUD, Busca, Listagem
│   │   │   ├── PedidoController.js    # Criar, Cancelar, Aprovar
│   │   │   ├── PagamentoController.js # PIX, Boleto, Cartão
│   │   │   ├── FreteController.js     # Cálculo dinâmico de frete
│   │   │   └── ContatoController.js   # Gerenciamento de mensagens
│   │   │
│   │   ├── 📊 models/                # Schemas Mongoose
│   │   │   ├── Usuario.js             # {nome, email, cpf, telefone, senha}
│   │   │   ├── Produto.js             # {código, nome, preço, estoque}
│   │   │   ├── Pedido.js              # {número, itens, status, total}
│   │   │   └── Contato.js             # {nome, assunto, mensagem}
│   │   │
│   │   ├── 🛣️ routes/                # Roteamento de endpoints (6 routers)
│   │   │   ├── authRoutes.js          # /api/auth/*
│   │   │   ├── produtoRoutes.js       # /api/produtos/*
│   │   │   ├── pedidoRoutes.js        # /api/pedidos/*
│   │   │   ├── pagamentoRoutes.js     # /api/pagamento/*
│   │   │   ├── freteRoutes.js         # /api/frete/*
│   │   │   └── contatoRoutes.js       # /api/contatos/*
│   │   │
│   │   └── 🚀 server.js              # Inicialização, middlewares
│   │
│   ├── package.json                  # Dependências + Scripts
│   └── .env.example                  # Template de variáveis
│
├── 🎨 frontend/                      # SPA Vanilla JS
│   ├── 📄 index.html                 # Página inicial
│   │
│   ├── 📁 Pages/ (13 páginas HTML)
│   │   ├── About.html                # Sobre a empresa
│   │   ├── Address.html              # Endereço de entrega
│   │   ├── Cart.html                 # Carrinho de compras
│   │   ├── Conclude.html             # Confirmação
│   │   ├── Contact.html              # Contato
│   │   ├── Dashboard.html            # Painel do usuário
│   │   ├── Login.html                # Login
│   │   ├── Payment.html              # Pagamento
│   │   ├── ProductDetail.html        # Detalhes do produto
│   │   ├── Products.html             # Catálogo
│   │   ├── Register.html             # Registro
│   │   ├── Revision.html             # Revisão final
│   │   └── Search.html               # Busca
│   │
│   └── 📁 Assets/
│       ├── 🎨 Css/                   # Estilos (um por página)
│       ├── 🖼️ Images/                # Imagens, ícones, SVG
│       └── ⚙️ Js/                    # Scripts (um por página)
│
├── 📄 README.md                      # Documentação em Inglês
├── 📄 README.pt-BR.md                # Documentação em Português
├── 📄 LICENSE                        # MIT License
└── package.json                      # Root config

```

---

## 🚀 Setup & Instalação

### Pré-requisitos
- **Node.js** (v16+) — [Download](https://nodejs.org/)
- **npm** ou **yarn** — Gerenciador de pacotes
- **MongoDB** — [Community](https://www.mongodb.com/try/download/community) ou [Atlas Cloud](https://www.mongodb.com/cloud/atlas)
- **Editor de Código** — VS Code recomendado

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

Crie um arquivo `.env` na raiz de `backend/`:

```bash
cp .env.example .env
```

Preencha as variáveis de ambiente (veja seção abaixo).

### Passo 3️⃣ — Iniciar o Servidor

```bash
npm start
# ou com auto-reload:
npm run dev
```

Servidor disponível em: **http://localhost:3000**

Verificar status: `curl http://localhost:3000/api/status`

### Passo 4️⃣ — Configurar Frontend

**Opção A — Live Server (VS Code)** ⭐ Recomendado
1. Abra `frontend` no VS Code
2. Clique direito em `index.html`
3. "Open with Live Server"
4. Abre em `http://localhost:5500`

**Opção B — Python**
```bash
cd frontend
python -m http.server 8000
# http://localhost:8000
```

**Opção C — Node.js**
```bash
cd frontend
npx http-server
# http://localhost:8080
```

✅ Acesse:
- Frontend: `http://localhost:5500`
- Backend: `http://localhost:3000`
- API: `http://localhost:3000/api/status`

---

## 🔐 Variáveis de Ambiente

Crie `.env` em `backend/`:

```env
# SERVIDOR
PORT=3000
NODE_ENV=development

# BANCO DE DADOS
MONGODB_URI=mongodb://localhost:27017/engremaq
# Para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/engremaq

# AUTENTICAÇÃO JWT
JWT_SECRET=gere_uma_chave_aleatoria_de_32_caracteres_ou_mais
JWT_EXPIRATION=7d

# EMAIL (Gmail com Nodemailer)
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app_google
EMAIL_FROM=noreply@engremaq.com.br

# MERCADO PAGO
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui

# PIX (dados reais)
PIX_CHAVE=seu_email_ou_cpf_ou_celular@gmail.com
PIX_NOME=Nome Completo
PIX_CIDADE=Fortaleza

# CORS
CORS_ORIGIN=http://localhost:5500,http://localhost:8000,http://localhost:3000
```

### 🔑 Gerar Chaves Seguras

**JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Senha de App Google:** [Clique aqui](https://myaccount.google.com/apppasswords)

---

## 📡 API REST - Endpoints

### Base URL
```
http://localhost:3000/api
```

### 🔐 Autenticação | `/auth/*`

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/auth/registrar` | Novo usuário | `{nome, email, cpf, telefone, senha}` |
| POST | `/auth/login` | Login | `{email, senha}` |
| POST | `/auth/solicitar-codigo` | 2FA | `{email}` |
| POST | `/auth/verificar-codigo` | Validar 2FA | `{email, codigo}` |
| POST | `/auth/alterar-email` | Trocar email | `{emailAnterior, emailNovo, senha}` |
| POST | `/auth/alterar-senha` | Trocar senha | `{email, senhaAtual, senhaNova}` |
| POST | `/auth/confirmar-exclusao` | Deletar conta | `{email, codigo}` |

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","senha":"123456"}'
```

### 🛍️ Produtos | `/produtos`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/produtos` | Listar (com filtros, busca, paginação) |
| GET | `/produtos/:id` | Detalhes |
| GET | `/produtos/buscar/:nome` | Busca por nome |
| GET | `/categorias` | Listar categorias |

### 📦 Pedidos | `/pedidos`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/pedidos/criar` | Criar |
| GET | `/pedidos/:usuarioId` | Listar por usuário |
| GET | `/pedidos/:numero/detalhes` | Detalhes |
| PUT | `/pedidos/:numero/cancelar` | Cancelar |
| PUT | `/pedidos/:numero/aprovar` | Aprovar (admin) |

### 💳 Pagamentos | `/pagamento`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/pagamento/gerar` | Gerar (pix, boleto, cartao) |
| POST | `/pagamento/checkout` | Processar |
| GET | `/pagamento/:pedidoId/status` | Status |

### 🚚 Frete | `/frete`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/frete/calcular` | Calcular dinamicamente |
| GET | `/frete/opcoes` | Opções de entrega |

### 📧 Contato | `/contatos`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/contatos` | Enviar mensagem |
| GET | `/contatos/:id` | Obter mensagem |

---

## ⭐ Features Implementadas

### 🔑 Autenticação & Segurança
- ✅ Registro com validação (email, CPF, telefone)
- ✅ Login com JWT + expiração
- ✅ Hashing Bcrypt (10+ rounds)
- ✅ 2FA por email/código
- ✅ Alterar email/senha
- ✅ Exclusão de conta segura
- ✅ CORS configurável
- ✅ Proteção contra força bruta

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
- ✅ Múltiplas transportadoras
- ✅ Estimativa de prazo

### 💰 Pagamentos
- ✅ **PIX** com QR Code dinâmico
- ✅ **Boleto** via Mercado Pago
- ✅ **Cartão de Crédito** com processamento seguro
- ✅ Validação de dados
- ✅ Confirmação de transação
- ✅ Histórico de pagamentos

### 📦 Pedidos
- ✅ Número único por pedido
- ✅ Histórico completo
- ✅ Cancelamento de pedido
- ✅ Aprovação (admin)
- ✅ Rastreamento de status
- ✅ Detalhes completos

### 📊 Dashboard
- ✅ Perfil completo do usuário
- ✅ Histórico de pedidos
- ✅ Detalhes de cada pedido
- ✅ Cancelamentos
- ✅ Redefinir dados

### 🔍 Catálogo & Busca
- ✅ Listagem com filtros
- ✅ Busca por nome/código
- ✅ Filtro por categoria
- ✅ Paginação eficiente
- ✅ Detalhes técnicos
- ✅ Imagens responsivas

### 📧 Comunicação
- ✅ Formulário de contato
- ✅ Envio de emails
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
**Por quê?** Separação total entre Frontend e Backend

**Benefícios:**
- 📈 Escalabilidade independente
- 🔄 API reutilizável (Mobile, PWA)
- 🛠️ Equipes trabalham em paralelo
- 🌐 API-First Design

### 2. Frontend: Vanilla JS (sem React/Vue)
**Por quê?** JavaScript puro ES6+

**Benefícios:**
- 🧠 Domínio profundo de fundamentos
- ⚡ Zero overhead (bundle pequeno)
- 🎓 Sem lock-in de framework
- 🔍 Código mais legível e manutenível

### 3. localStorage para Carrinho
**Por quê?** localStorage + sincronização backend

**Benefícios:**
- ⚡ Rápido (sem HTTP a cada produto)
- 📴 Funciona offline
- 💾 Persiste através de refreshes
- 🔒 Backend valida no checkout

### 4. MongoDB (NoSQL)
**Por quê?** Flexibilidade de schema

**Benefícios:**
- 🔄 Schema flexível
- 📦 JSON nativo
- ⚡ Rápido para prototipagem
- 🌍 Escalabilidade horizontal

### 5. JWT (Stateless)
**Por quê?** Autenticação sem estado

**Benefícios:**
- 🔓 Sem sessões no servidor
- 📱 Mobile-friendly
- 🛡️ Seguro (assinado)
- ⚡ Distribuído/escalável

---

## 💡 Performance & Otimizações

### Frontend
- 🎯 **CSS Granular** — CSS por página (sem carregamento desnecessário)
- ⚡ **Lazy Loading** — Imagens sob demanda com `loading="lazy"`
- 🔄 **Fetch com timeout** — Evita requisições penduradas
- 📦 **Minificação** — Em produção

### Backend
- 📊 **Mongoose Indexes** — Índices em campos frequentes
- 🚀 **Paginação** — 20 itens por padrão
- 💾 **Caching** — Redis para produtos (futuro)
- 🔐 **Rate Limiting** — Proteção contra força bruta
- 🗜️ **GZIP** — Compressão automática de respostas

---

## 🧪 Testes

Preparado para implementação com Jest e Vitest.

### Backend
```bash
npm install --save-dev jest supertest
```

Testes: Autenticação, Validação, Frete, Pedidos, Pagamentos

### Frontend
```bash
npm install --save-dev vitest @testing-library/dom
```

Testes: Carrinho, Formulários, Mocks de API

---

## 🚀 Deployment

### Backend

**Railway / Render / Fly.io:**
- Criar conta + conectar GitHub
- Configurar variáveis de ambiente
- Deploy automático

**DigitalOcean / AWS:**
- Instalar Node.js
- PM2 para auto-restart
- Nginx como reverse proxy

### Frontend

**Vercel:**
```bash
npm install -g vercel
vercel frontend/
```

**Netlify:** Conectar repo

**GitHub Pages:** Branch `gh-pages`

---

## 📚 Recursos & Referências

- [Express.js Docs](https://expressjs.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Mercado Pago API](https://developers.mercadopago.com/)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [OWASP Security](https://owasp.org/)

---

## 📝 Padrões de Código

### Controller
```javascript
exports.criar = async (req, res) => {
  try {
    const dados = req.body;
    if (!dados.email) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Email obrigatório" 
      });
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

**Padrões:** Prettier (2 espaços), testes, commits claros

---

## 🗺️ Roadmap & Melhorias Futuras

### Curto Prazo (1-3 meses)
- [ ] Testes unitários (Jest, Vitest)
- [ ] Rate limiting avançado
- [ ] Avaliações de produtos (⭐)
- [ ] Wishlist/Favoritos
- [ ] Live chat
- [ ] Notificações SMS/Email

### Médio Prazo (3-6 meses)
- [ ] Dashboard administrativo
- [ ] Sistema de cupons/promoções
- [ ] Google Analytics integrado
- [ ] PWA (offline-first)
- [ ] Redis caching
- [ ] Testes E2E (Cypress)

### Longo Prazo (6+ meses)
- [ ] App Mobile (React Native)
- [ ] Marketplace
- [ ] Programa de afiliados
- [ ] Integração ERP
- [ ] Machine Learning (recomendações)
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
