# 🏗️ ArchiVision AI - Plateforme d'Architecture Intelligente

> L'équivalent d'un mélange entre AutoCAD, Revit, Planner 5D, Floorplanner, Homestyler et ChatGPT — spécialisé dans l'architecture.

![Stack](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Stack](https://img.shields.io/badge/Fastify-4-000000?logo=fastify)
![Stack](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![Stack](https://img.shields.io/badge/Three.js-0.169-000000?logo=threedotjs)
![Stack](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)

---

## ✨ Fonctionnalités

### 🤖 IA Générative
- **Génération de plans** : Décrivez votre projet et recevez 4 propositions de plans architecturaux
- **Modification par instruction** : "Agrandis le salon", "Ajoute un garage"
- **Chat conversationnel** : Discutez avec l'IA spécialisée en architecture
- **Multi-modèles IA** : 6 modèles gratuits via OpenRouter (Dolphin Mistral, Llama 3.1, Gemini, DeepSeek...)

### 📐 Éditeur de Plans 2D
- Visualisation interactive des plans avec SVG
- Couleurs par type de pièce (salon, chambre, cuisine, SdB...)
- Zoom, déplacement, sélection d'étages
- Affichage des dimensions et surfaces

### 🏠 Modélisation 3D
- Vue 3D avec Three.js / React Three Fiber
- Modèle généré automatiquement depuis le plan 2D
- Contrôles orbitaux, éclairage, environnement
- Visite virtuelle pièce par pièce (PointerLock)

### 💰 Estimation Budget
- **Matériaux** : Calcul quantitatif pour 16 matériaux (ciment, fer, carrelage...)
- **Budget multi-pays** : Bénin 🇧🇯, Togo 🇹🇬, Côte d'Ivoire 🇨🇮, Sénégal 🇸🇳, France 🇫🇷, Canada 🇨🇦, USA 🇺🇸
- **4 niveaux** : Économique, Standard, Premium, Luxe
- Détail matériaux + main d'œuvre + frais généraux

### 📦 Exports
- **JSON** : Données complètes du projet
- **SVG** : Plan vectoriel 2D
- **DXF** : Compatible AutoCAD
- **OBJ** : Modèle 3D

### 👥 Collaboration
- Invitation par email (Lecteur / Éditeur / Admin)
- Commentaires sur les plans
- Historique des versions

### ⚙️ Administration
- Dashboard avec statistiques
- Gestion des utilisateurs
- Gestion des abonnements (Free / Pro / Architecte / Entreprise)
- Logs d'activité

---

## 🚀 Installation

### Prérequis
- **Node.js** 18+
- **PostgreSQL** (ou SQLite en dev)
- **npm** ou **pnpm**

### 1. Cloner le projet
```bash
git clone <repo-url>
cd archivision
```

### 2. Configuration
```bash
cp .env.example .env
# Éditer .env avec vos clés
```

Variables requises :
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/archivision
# ou pour SQLite : file:./dev.db
JWT_SECRET=votre-secret-jwt
OPENROUTER_API_KEY=votre-clé-openrouter  # Gratuit sur openrouter.ai
```

### 3. Backend
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 4. Frontend
```bash
cd client
npm install
npm run dev
```

### 5. Ouvrir
- Frontend : http://localhost:5173
- API : http://localhost:3001

---

## 🏗️ Architecture

```
archivision/
├── server/                    # Backend API (Fastify + Prisma)
│   ├── prisma/schema.prisma   # Schéma BDD
│   ├── src/
│   │   ├── index.ts           # Point d'entrée
│   │   ├── config/            # Configuration
│   │   ├── middleware/        # Auth JWT, Rate limiting
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.ts        # Authentification
│   │   │   ├── projects.ts    # CRUD projets
│   │   │   ├── ai.ts          # Génération IA
│   │   │   ├── estimates.ts   # Estimations
│   │   │   ├── exports.ts     # Exports multi-format
│   │   │   └── admin.ts       # Administration
│   │   ├── services/          # Logique métier
│   │   │   ├── aiService.ts   # OpenRouter / OpenAI
│   │   │   ├── planGenerator.ts  # Génération de plans
│   │   │   ├── estimator.ts   # Calcul matériaux/budget
│   │   │   └── exportService.ts  # SVG/DXF/OBJ
│   │   └── utils/             # Prix matériaux
│   └── package.json 
│
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # AppShell, Sidebar, Header
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── dashboard/     # Dashboard, ProjectCard, Stats
│   │   │   ├── project/       # Wizard (3 étapes), PlanSelector
│   │   │   ├── editor/        # EditorLayout, FloorPlan, ToolBar, AIChat
│   │   │   ├── viewer/        # Scene3D, VirtualTour
│   │   │   ├── estimates/     # MaterialEstimate, BudgetEstimate
│   │   │   ├── export/        # ExportPanel
│   │   │   ├── collab/        # CollabPanel
│   │   │   └── admin/         # AdminDashboard, UserManagement
│   │   ├── pages/             # 6 pages (Landing, Auth, Dashboard, Editor, Admin, Pricing)
│   │   ├── store/             # Zustand (auth, project, ui)
│   │   ├── hooks/             # useAuth, useProject
│   │   ├── lib/               # API client, utils
│   │   ├── config/            # Modèles IA, matériaux
│   │   └── types/             # TypeScript interfaces
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🧪 Stack Technique

| Composant | Technologie |
|-----------|------------|
| **Frontend** | React 18.3, Vite 5, TailwindCSS 3.4, Framer Motion |
| **3D** | Three.js, React Three Fiber, React Three Drei |
| **State** | Zustand 5, TanStack React Query |
| **Backend** | Fastify 4, TypeScript |
| **BDD** | PostgreSQL / SQLite via Prisma 5 |
| **Auth** | JWT (access + refresh tokens) |
| **IA** | OpenRouter API (6 modèles gratuits) |
| **UI** | Lucide Icons, Radix UI, Headless UI |

---

## 📄 Licence

MIT © 2026 ArchiVision — Tous droits réservés.