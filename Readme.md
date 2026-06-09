<p align="center">
  <img src="https://img.shields.io/badge/PetSphere-🐾-emerald?style=for-the-badge&labelColor=064e3b&color=059669" alt="PetSphere" />
</p>

<h1 align="center">🐾 PetSphere</h1>

<p align="center">
  <strong>The AI-Powered Pet Health Operating System</strong><br/>
  Premium e-commerce for pet supplies & fresh food · Integrated 24/7 AI Vet Assistant
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-MVP--1-blue?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/license-ISC-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/react-19.x-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/node.js-express-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
</p>

---

## 📖 About

**PetSphere** is a full-stack e-commerce platform for pet supplies and fresh food, designed for modern pet parents. It combines an intuitive shopping experience with **Cuddles AI** — an integrated 24/7 AI veterinary assistant that provides instant, personalized pet care guidance using Retrieval-Augmented Generation (RAG).

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🛒 **Pet Store & Fresh Food** | Browse and order pet supplies, meals, and health products with cart & checkout |
| 🤖 **Cuddles AI** | 24/7 AI vet assistant powered by Groq + RAG for accurate, policy-aware responses |
| 🏥 **Tele-Vet Consultations** | Discover and book veterinary consultations online |
| 🐕 **Pet Profiles** | Manage multiple pet profiles with breed, age, and weight tracking |
| 🌐 **PetSphere Community** | Social feed for pet parents to share moments and connect |
| 📊 **Seller Panel** | Kitchen/seller partner dashboard for order management and revenue tracking |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Tailwind CSS, React Router DOM, Lucide Icons |
| **Backend** | Node.js, Express 5 |
| **Database** | PostgreSQL (via Supabase), Prisma ORM |
| **AI / LLM** | Groq API (LLaMA 3.1), RAG with pgvector embeddings |
| **Auth** | Supabase Auth (Email/Password + Google OAuth) |
| **Embeddings** | @xenova/transformers (local, free) |
| **State Management** | React Context API |

---

## 📁 Project Structure

```text
PetSphere/
├── petsphere-backend/          # Express API server
│   ├── src/
│   │   ├── controllers/        # Route handlers (AI, pets, users, products, admin)
│   │   ├── routes/             # Express route definitions
│   │   ├── middleware/         # Auth middleware (JWT verification)
│   │   └── utils/              # Embedding utilities
│   ├── prisma/                 # Prisma schema & migrations
│   └── server.js               # Express app entry point
│
├── petsphere-frontend/         # React SPA
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Auth, Dashboard, VetCard, etc.)
│   │   ├── pages/              # Route-level screens
│   │   ├── context/            # Global state (CartContext)
│   │   ├── data/               # Mock datasets
│   │   ├── layouts/            # App layout shell
│   │   └── utils/              # Supabase client config
│   └── public/                 # Static assets
│
├── prisma/                     # Root-level Prisma config
├── PROJECT_PRD.md              # Product Requirements Document
├── FRONTEND_ARCHITECTURE.md    # Frontend architecture reference
└── README.md                   # ← You are here
```

---

## 🚀 How to Run Locally

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **PostgreSQL** database (or Supabase project)
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/PetSphere.git
cd PetSphere
```

### 2. Install Dependencies

```bash
# Root dependencies (Prisma)
npm install

# Backend
cd petsphere-backend
npm install

# Frontend
cd ../petsphere-frontend
npm install
```

### 3. Set Up Environment Variables

Create `.env` files as described in the [Environment Variables](#-environment-variables) section below.

### 4. Start the Development Servers

```bash
# Terminal 1 — Backend (from petsphere-backend/)
npm start
# → Runs on http://localhost:5000

# Terminal 2 — Frontend (from petsphere-frontend/)
npm start
# → Runs on http://localhost:3000
```

---

## 🔐 Environment Variables

### Root `.env`

```env
DATABASE_URL=your_prisma_postgres_connection_string
```

### `petsphere-backend/.env`

```env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_postgresql_connection_string
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### `petsphere-frontend/.env`

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_BACKEND_URL=http://localhost:5000
```

> ⚠️ **Never commit `.env` files to version control.** They are excluded via `.gitignore`.

---

## 🧪 Testing

```bash
# Frontend tests
cd petsphere-frontend
npm test
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

<p align="center">
  Built with ❤️ for pets and their humans<br/>
  <strong>PetSphere</strong> — Smarter care, happier pets. 🐾
</p>
