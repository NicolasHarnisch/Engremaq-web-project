# Engremaq - Enterprise E-Commerce Platform for Agricultural Parts 🚜

> **Production-Ready Full Stack Solution** — B2B/B2C E-commerce Platform with Secure Payment Integration (PIX, Boleto, Credit Card), JWT Authentication & Real-Time Order Management

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

**Engremaq** is a full-featured, production-ready e-commerce platform built with a **decoupled Client-Server architecture** for distributing agricultural equipment parts and tractor components. This comprehensive project demonstrates enterprise-level Full Stack development, including secure JWT authentication with bcrypt, multiple payment methods (PIX with QR Code generation, Boleto, Credit Card), Mercado Pago integration, real-time inventory management, and a professional user dashboard.

Perfect for showcasing expertise in REST API design, cybersecurity best practices, scalable database architecture, responsive UX/UI, and cloud-ready deployment strategies.

> 📚 **Documentation Available In:** 🇺🇸 English (this file) | [🇧🇷 Portuguese (Português)](README.pt-BR.md)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Project Architecture](#-project-architecture)
- [Technologies & Dependencies](#️-technologies--dependencies)
- [Folder Structure](#-folder-structure)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [REST API - Endpoints & Documentation](#-rest-api---endpoints--documentation)
- [Implemented Features](#-implemented-features)
- [User Purchase Flow](#️-user-purchase-flow)
- [Technical Decisions & Trade-offs](#-technical-decisions--trade-offs)
- [Performance & Optimizations](#-performance--optimizations)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Resources & References](#-resources--references)
- [Code Patterns](#-code-patterns)
- [How to Contribute](#-how-to-contribute)
- [Roadmap & Future Improvements](#️-roadmap--future-improvements)
- [Author](#-author)

---

## 🎯 Overview

This project demonstrates **full-stack expertise** in modern web development. The application follows **SOLID principles**, **separation of concerns (MVC)**, and **cybersecurity best practices**.

### ✨ Key Highlights:
✅ **Secure Authentication** — JWT + Tokens, Bcrypt with 10+ rounds, 2FA via Email  
✅ **Multiple Payment Methods** — PIX (Dynamic QR Code), Boleto, Credit Card  
✅ **Complete Dashboard** — Order history, cancellations, approvals & account management  
✅ **Smart Cart Management** — Persistent cart with dynamic freight calculation  
✅ **Extensible REST API** — Ready for mobile app integration, PWAs & third-party services  
✅ **Vanilla JS Frontend** — Pure JavaScript without unnecessary frameworks, advanced DOM & State Management  

---

## 🏗️ Project Architecture

### Decoupled Client-Server Model

```
┌──────────────────────────────────────────────────────────────────┐
│         FRONTEND (Vanilla JavaScript + HTML5/CSS3)               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Pages/         → 13 responsive HTML pages                 │  │
│  │  Assets/        → Granular CSS & JS (one per page)         │  │
│  │  Fetch API      → Asynchronous backend communication       │  │
│  │  localStorage   → Cart & data persistence                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTP/HTTPS + JSON
┌──────────────────────▼───────────────────────────────────────────┐
│              BACKEND (Node.js + Express.js)                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Routes/        → RESTful endpoint definitions              │  │
│  │  Controllers/   → Separated business logic                  │  │
│  │  Models/        → MongoDB Mongoose schemas                  │  │
│  │  Middleware     → JWT Auth, CORS, Validation               │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼───────────────────────────────────────────┐
│                  DATABASE (MongoDB)                               │
│  Collections: User, Product, Order, Payment, Contact            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technologies & Dependencies

### Backend (Node.js + Express)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | v16+ | JavaScript Runtime |
| **Express.js** | 5.2.1 | HTTP Web Framework |
| **MongoDB** | 7.1.0 | NoSQL Database |
| **Mongoose** | 9.2.4 | MongoDB ODM |
| **JWT** | 9.0.3 | Token-based Authentication |
| **Bcrypt** | 6.0.0 | Secure Password Hashing |
| **Mercado Pago API** | 2.12.0 | Payment Gateway |
| **QRCode** | 1.5.4 | QR Code Generation for PIX |
| **Nodemailer** | 8.0.1 | Email Delivery |
| **Axios** | 1.13.6 | HTTP Client |
| **CORS** | 2.8.6 | Cross-Origin Resource Sharing |
| **dotenv** | 17.3.1 | Environment Variable Management |

### Frontend (HTML5 + CSS3 + Vanilla JS)
- **HTML5** — Semantic markup, accessibility & SEO
- **CSS3** — Flexbox, Grid, media queries, animations
- **JavaScript ES6+** — Async/await, Classes, Arrow Functions
- **Fetch API** — Asynchronous HTTP requests

---

## 📁 Folder Structure

```
Engremaq-web-project/
│
├── 📦 backend/                       # Node.js REST API
│   ├── src/
│   │   ├── 🔌 controllers/           # Business Logic (6 controllers)
│   │   │   ├── AuthController.js      # Register, Login, 2FA, Account
│   │   │   ├── ProdutoController.js   # CRUD, Search, Listing
│   │   │   ├── PedidoController.js    # Create, Cancel, Approve
│   │   │   ├── PagamentoController.js # PIX, Boleto, Card
│   │   │   ├── FreteController.js     # Dynamic Freight Calculation
│   │   │   └── ContatoController.js   # Message Management
│   │   │
│   │   ├── 📊 models/                # Mongoose Schemas
│   │   │   ├── Usuario.js             # {name, email, cpf, phone, pwd}
│   │   │   ├── Produto.js             # {code, name, price, stock}
│   │   │   ├── Pedido.js              # {number, items, status, total}
│   │   │   └── Contato.js             # {name, subject, message}
│   │   │
│   │   ├── 🛣️ routes/                # Endpoint Routing (6 routers)
│   │   │   ├── authRoutes.js          # /api/auth/*
│   │   │   ├── produtoRoutes.js       # /api/products/*
│   │   │   ├── pedidoRoutes.js        # /api/orders/*
│   │   │   ├── pagamentoRoutes.js     # /api/payment/*
│   │   │   ├── freteRoutes.js         # /api/freight/*
│   │   │   └── contatoRoutes.js       # /api/contacts/*
│   │   │
│   │   └── 🚀 server.js              # App initialization, middlewares
│   │
│   ├── package.json                  # Dependencies & Scripts
│   └── .env.example                  # Environment variables template
│
├── 🎨 frontend/                      # Vanilla JS SPA
│   ├── 📄 index.html                 # Home page
│   │
│   ├── 📁 Pages/ (13 HTML pages)
│   │   ├── About.html                # About company
│   │   ├── Address.html              # Delivery address
│   │   ├── Cart.html                 # Shopping cart
│   │   ├── Conclude.html             # Order confirmation
│   │   ├── Contact.html              # Contact form
│   │   ├── Dashboard.html            # User panel
│   │   ├── Login.html                # Login page
│   │   ├── Payment.html              # Payment selection
│   │   ├── ProductDetail.html        # Product details
│   │   ├── Products.html             # Product catalog
│   │   ├── Register.html             # Registration
│   │   ├── Revision.html             # Order review
│   │   └── Search.html               # Search page
│   │
│   └── 📁 Assets/
│       ├── 🎨 Css/                   # Styles (one per page)
│       ├── 🖼️ Images/                # Images, icons, SVG
│       └── ⚙️ Js/                    # Scripts (one per page)
│
├── 📄 README.md                      # English Documentation
├── 📄 README.pt-BR.md                # Portuguese Documentation
├── 📄 LICENSE                        # MIT License
└── package.json                      # Root config

```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v16+) — [Download](https://nodejs.org/)
- **npm** or **yarn** — Package manager
- **MongoDB** — [Community](https://www.mongodb.com/try/download/community) or [Atlas Cloud](https://www.mongodb.com/cloud/atlas)
- **Code Editor** — VS Code recommended

### Step 1️⃣ — Clone Repository

```bash
git clone https://github.com/NicolasHarnisch/Engremaq-web-project.git
cd Engremaq-web-project
```

### Step 2️⃣ — Configure Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` root:

```bash
cp .env.example .env
```

Fill in environment variables (see section below).

### Step 3️⃣ — Start Server

```bash
npm start
# or with auto-reload:
npm run dev
```

Server available at: **http://localhost:3000**

Check status: `curl http://localhost:3000/api/status`

### Step 4️⃣ — Configure Frontend

**Option A — Live Server (VS Code)** ⭐ Recommended
1. Open `frontend` in VS Code
2. Right-click on `index.html`
3. "Open with Live Server"
4. Opens at `http://localhost:5500`

**Option B — Python**
```bash
cd frontend
python -m http.server 8000
# http://localhost:8000
```

**Option C — Node.js**
```bash
cd frontend
npx http-server
# http://localhost:8080
```

✅ Access:
- Frontend: `http://localhost:5500`
- Backend: `http://localhost:3000`
- API: `http://localhost:3000/api/status`

---

## 🔐 Environment Variables

Create `.env` in `backend/`:

```env
# SERVER
PORT=3000
NODE_ENV=development

# DATABASE
MONGODB_URI=mongodb://localhost:27017/engremaq
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/engremaq

# JWT AUTHENTICATION
JWT_SECRET=generate_a_random_key_of_32_characters_or_more
JWT_EXPIRATION=7d

# EMAIL (Gmail with Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
EMAIL_FROM=noreply@engremaq.com.br

# MERCADO PAGO
MERCADOPAGO_ACCESS_TOKEN=your_token_here

# PIX (real data)
PIX_CHAVE=your_email_or_cpf_or_phone@gmail.com
PIX_NOME=Full Name
PIX_CIDADE=City

# CORS
CORS_ORIGIN=http://localhost:5500,http://localhost:8000,http://localhost:3000
```

### 🔑 Generate Secure Keys

**JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Google App Password:** [Click here](https://myaccount.google.com/apppasswords)

---

## 📡 REST API - Endpoints

### Base URL
```
http://localhost:3000/api
```

### 🔐 Authentication | `/auth/*`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | New user | `{name, email, cpf, phone, password}` |
| POST | `/auth/login` | Login | `{email, password}` |
| POST | `/auth/request-code` | 2FA | `{email}` |
| POST | `/auth/verify-code` | Verify 2FA | `{email, code}` |
| POST | `/auth/change-email` | Change email | `{oldEmail, newEmail, password}` |
| POST | `/auth/change-password` | Change password | `{email, currentPassword, newPassword}` |
| POST | `/auth/confirm-deletion` | Delete account | `{email, code}` |

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
```

### 🛍️ Products | `/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all (filters, search, pagination) |
| GET | `/products/:id` | Details |
| GET | `/products/search/:name` | Search by name |
| GET | `/categories` | List categories |

### 📦 Orders | `/orders`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders/create` | Create |
| GET | `/orders/:userId` | List by user |
| GET | `/orders/:number/details` | Details |
| PUT | `/orders/:number/cancel` | Cancel |
| PUT | `/orders/:number/approve` | Approve (admin) |

### 💳 Payments | `/payment`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payment/generate` | Generate (pix, boleto, card) |
| POST | `/payment/checkout` | Process |
| GET | `/payment/:orderId/status` | Status |

### 🚚 Freight | `/freight`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/freight/calculate` | Calculate dynamically |
| GET | `/freight/options` | Delivery options |

### 📧 Contacts | `/contacts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contacts` | Send message |
| GET | `/contacts/:id` | Get message |

---

## ⭐ Implemented Features

### 🔑 Authentication & Security
- ✅ User registration with validation (email, CPF, phone)
- ✅ JWT login with expiration
- ✅ Bcrypt hashing (10+ rounds)
- ✅ 2FA via email code
- ✅ Change email/password
- ✅ Secure account deletion
- ✅ Configurable CORS
- ✅ Brute force protection

### 🛒 Cart & Purchase
- ✅ localStorage persistence
- ✅ Add/remove products
- ✅ Quantity adjustment
- ✅ Real-time subtotal calculation
- ✅ Backend synchronization

### 📍 Address & Freight
- ✅ Multiple addresses per user
- ✅ ZIP code validation
- ✅ Dynamic freight calculation
- ✅ Multiple carriers
- ✅ Delivery estimates

### 💰 Payments
- ✅ **PIX** with dynamic QR Code
- ✅ **Boleto** via Mercado Pago
- ✅ **Credit Card** with secure processing
- ✅ Data validation
- ✅ Transaction confirmation
- ✅ Payment history

### 📦 Orders
- ✅ Unique order numbers
- ✅ Complete history
- ✅ Order cancellation
- ✅ Approval (admin)
- ✅ Status tracking
- ✅ Full details

### 📊 Dashboard
- ✅ Complete user profile
- ✅ Order history
- ✅ Order details
- ✅ Cancellations
- ✅ Data reset

### 🔍 Catalog & Search
- ✅ Listing with filters
- ✅ Search by name/code
- ✅ Category filter
- ✅ Efficient pagination
- ✅ Technical details
- ✅ Responsive images

### 📧 Communication
- ✅ Contact form
- ✅ Email delivery
- ✅ Order notifications
- ✅ Email verification

---

## 🛣️ User Purchase Flow

```
HOME
  ↓
PRODUCTS (Search, Filter)
  ↓
PRODUCT DETAIL
  ↓
CART (Review items)
  ↓
LOGIN / REGISTER (Authentication)
  ↓
ADDRESS (Validate, multiple)
  ↓
FREIGHT (Select carrier)
  ↓
PAYMENT (PIX, Boleto, Card)
  ↓
REVIEW (Confirm data)
  ↓
CONCLUSION (Success/Error)
  ↓
DASHBOARD (History)
```

---

## 🧠 Technical Decisions & Trade-offs

### 1. Architecture: Decoupled MVC
**Why?** Complete separation between Frontend and Backend

**Benefits:**
- 📈 Independent scalability
- 🔄 Reusable API (Mobile, PWA)
- 🛠️ Teams work in parallel
- 🌐 API-First Design

### 2. Frontend: Vanilla JS (no React/Vue)
**Why?** Pure ES6+ JavaScript

**Benefits:**
- 🧠 Deep understanding of fundamentals
- ⚡ Zero overhead (small bundle)
- 🎓 No framework lock-in
- 🔍 More readable code

### 3. localStorage for Cart
**Why?** localStorage + backend sync

**Benefits:**
- ⚡ Fast (no HTTP per product)
- 📴 Works offline
- 💾 Persists across refreshes
- 🔒 Backend validates at checkout

### 4. MongoDB (NoSQL)
**Why?** Schema flexibility

**Benefits:**
- 🔄 Flexible schema
- 📦 Native JSON
- ⚡ Fast prototyping
- 🌍 Horizontal scalability

### 5. JWT (Stateless)
**Why?** Authentication without state

**Benefits:**
- 🔓 No server sessions
- 📱 Mobile-friendly
- 🛡️ Signed (secure)
- ⚡ Distributed/scalable

---

## 💡 Performance & Optimizations

### Frontend
- 🎯 **Granular CSS** — CSS per page (no unnecessary loading)
- ⚡ **Lazy Loading** — Images on-demand with `loading="lazy"`
- 🔄 **Fetch with timeout** — Prevents hanging requests
- 📦 **Minification** — In production

### Backend
- 📊 **Mongoose Indexes** — Indexes on frequent fields
- 🚀 **Pagination** — 20 items by default
- 💾 **Caching** — Redis for products (future)
- 🔐 **Rate Limiting** — Brute force protection
- 🗜️ **GZIP** — Automatic response compression

---

## 🧪 Testing

Ready for implementation with Jest and Vitest.

### Backend
```bash
npm install --save-dev jest supertest
```

Tests: Authentication, Validation, Freight, Orders, Payments

### Frontend
```bash
npm install --save-dev vitest @testing-library/dom
```

Tests: Cart, Forms, API Mocks

---

## 🚀 Deployment

### Backend

**Railway / Render / Fly.io:**
- Create account + connect GitHub
- Set environment variables
- Automatic deployment

**DigitalOcean / AWS:**
- Install Node.js
- PM2 for auto-restart
- Nginx as reverse proxy

### Frontend

**Vercel:**
```bash
npm install -g vercel
vercel frontend/
```

**Netlify:** Connect repo

**GitHub Pages:** `gh-pages` branch

---

## 📚 Resources & References

- [Express.js Docs](https://expressjs.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Mercado Pago API](https://developers.mercadopago.com/)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [OWASP Security](https://owasp.org/)

---

## 📝 Code Patterns

### Controller
```javascript
exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (!data.email) {
      return res.status(400).json({ 
        success: false, 
        error: "Email required" 
      });
    }
    const result = await Model.create(data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### Fetch (Frontend)
```javascript
async function fetchProducts(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/products?${params}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    showError("Failed to load.");
  }
}
```

---

## 🤝 How to Contribute

1. Fork the repository
2. `git checkout -b feature/MyFeature`
3. `git commit -m 'Add MyFeature'`
4. `git push origin feature/MyFeature`
5. Open Pull Request

**Standards:** Prettier (2 spaces), tests, clear commits

---

## 🗺️ Roadmap & Future Improvements

### Short Term (1-3 months)
- [ ] Unit tests (Jest, Vitest)
- [ ] Advanced rate limiting
- [ ] Product reviews (⭐)
- [ ] Wishlist/Favorites
- [ ] Live chat
- [ ] SMS/Email notifications

### Medium Term (3-6 months)
- [ ] Admin dashboard
- [ ] Coupons/promotions system
- [ ] Google Analytics
- [ ] PWA (offline-first)
- [ ] Redis caching
- [ ] E2E tests (Cypress)

### Long Term (6+ months)
- [ ] Mobile App (React Native)
- [ ] Marketplace
- [ ] Affiliate program
- [ ] ERP integration
- [ ] Machine Learning (recommendations)
- [ ] Multilingual (i18n)
- [ ] CI/CD (GitHub Actions)

---

## 👨‍💻 Author

**Nicolas Harnisch**

- 🐙 GitHub: [@NicolasHarnisch](https://github.com/NicolasHarnisch)
- 💼 LinkedIn: [LinkedIn](https://linkedin.com/in/nicolasharnisch)

---

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/NicolasHarnisch/Engremaq-web-project/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/NicolasHarnisch/Engremaq-web-project/discussions)

---

**Thank you for visiting! ⭐ If you liked it, leave a star on GitHub!**
