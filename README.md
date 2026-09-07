# AidLink — NGO & Disaster Relief Collaboration Platform

AidLink is a full-stack platform designed to connect NGOs, supporters, volunteers, and disaster-relief operations with real-time campaign tracking, verifiable expense audits, and volunteer coordination.

---

## 📁 Repository Structure

```
SOFTWARE/
├── docker-compose.yml       # Local Docker setup for PostgreSQL database
├── .env.example             # Root environment template for Docker Compose
├── .gitignore               # Root Git ignore configuration
├── README.md                # Project documentation and developer setup guide
├── ngo-backend/             # Node.js + Express + PostgreSQL API backend
│   ├── config/              # Database pool configuration
│   ├── controllers/         # Route business logic and handlers
│   ├── middleware/          # Authentication & verification middlewares
│   ├── migrations/          # Versioned SQL migration scripts
│   │   └── 001_initial_schema.sql
│   ├── routes/              # Express API route definitions
│   ├── scripts/             # Database management scripts
│   │   ├── migrate.js       # Migration runner
│   │   ├── seed.js          # Development seed generator
│   │   └── reset.js         # Safe development DB reset script
│   ├── uploads/             # Directory for uploaded documents/evidence
│   ├── .env.example         # Backend environment variable template
│   ├── .gitignore           # Backend Git ignore
│   ├── package.json         # Backend dependencies & npm scripts
│   └── server.js            # Express server entrypoint
└── ngo-platform/            # React 19 + Vite + TailwindCSS frontend
    ├── src/                 # React source files, components, and views
    ├── public/              # Static assets
    ├── package.json         # Frontend dependencies & scripts
    └── vite.config.js       # Vite build configuration
```

---

## 🛠️ Prerequisites

Before starting, ensure the following software is installed on your development machine:

1. **Node.js** (v18.x or later recommended) & **npm** (v9.x or later)
2. **Git**
3. **Docker Desktop** (Make sure Docker Desktop is installed and running)

> [!NOTE]
> You do **not** need to install PostgreSQL manually on your host machine; PostgreSQL runs inside a local Docker container managed by Docker Compose.

---

## 🚀 Quick Start Guide (Fresh Clone Setup)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SOFTWARE
```

### 2. Configure Environment Variables

#### Root Docker Environment:
```bash
cp .env.example .env
```

#### Backend Environment:
```bash
cd ngo-backend
cp .env.example .env
cd ..
```

*Inspect `ngo-backend/.env` to confirm settings. For local development, the default values in `.env.example` connect directly to Docker PostgreSQL.*

---

### 3. Start Local PostgreSQL via Docker

From the root directory:
```bash
docker compose up -d
```

Verify that PostgreSQL container is running:
```bash
docker compose ps
```

---

### 4. Install Dependencies, Migrate, and Seed Database

#### Backend Setup:
```bash
cd ngo-backend
npm install
npm run migrate
npm run seed
```

#### Frontend Setup:
```bash
cd ../ngo-platform
npm install
```

---

### 5. Start the Development Servers

#### Terminal 1 — Start Backend Server:
```bash
cd ngo-backend
npm run dev
```
*Backend runs at: `http://localhost:5000` (Health check endpoint: `http://localhost:5000/`)*

#### Terminal 2 — Start Frontend Application:
```bash
cd ngo-platform
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## 🔑 Development Test Credentials

The database seed (`npm run seed`) creates safe, dummy development accounts with pre-hashed credentials.

> [!IMPORTANT]
> These accounts and passwords are for **local development and testing only**. Never use them in staging or production environments.

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Verified NGO** | `ngo.hope@example.com` | `DevPass123!` | Org: *Hope Foundation India*, Status: `APPROVED`, Darpan ID: `DL/2020/0123456` |
| **Pending NGO** | `ngo.pending@example.com` | `DevPass123!` | Org: *Seva Relief Network*, Status: `PENDING` (tests pending state) |
| **Supporter / Volunteer** | `supporter.rahul@example.com` | `DevPass123!` | Name: *Rahul Mehta*, Aadhaar: `TEST-AADHAAR-001`, City: *Chandigarh* |

---

## 🗄️ Database Management & Scripts

All database commands are run inside the `ngo-backend/` directory:

| Command | Description |
| :--- | :--- |
| `npm run migrate` | Runs all pending SQL migrations in `migrations/` in sequential order within transactions. |
| `npm run seed` | Populates the database with safe development data (NGOs, supporters, campaigns, workshops, donations, expenses, evidence). |
| `npm run db:reset` | **(Development only)** Cleans public schema, re-runs migrations from scratch, and re-seeds dummy data. Protected against production usage. |

---

## 🐳 Useful Docker Commands

From the root directory:

* **Start PostgreSQL container in background**:
  ```bash
  docker compose up -d
  ```
* **Stop PostgreSQL container**:
  ```bash
  docker compose down
  ```
* **View container logs**:
  ```bash
  docker compose logs -f postgres
  ```
* **Wipe PostgreSQL container and volume (fresh slate)**:
  ```bash
  docker compose down -v
  ```

---

## 🔧 Troubleshooting

### 1. Docker daemon is not running
* **Error**: `Cannot connect to the Docker daemon` or `docker: command not found`.
* **Fix**: Ensure Docker Desktop is installed, running, and accessible in your system terminal PATH.

### 2. Port 5432 is already allocated
* **Error**: `Bind for 0.0.0.0:5432 failed: port is already allocated`.
* **Fix**: If you have a local PostgreSQL instance running natively on Windows/macOS, either stop the local PostgreSQL service or change `POSTGRES_PORT` in `.env` and `DB_PORT` / `DATABASE_URL` in `ngo-backend/.env` (e.g. to `5433`).

### 3. Backend connection refused (`ECONNREFUSED 127.0.0.1:5432`)
* **Fix**: Check `docker compose ps` to ensure the `aidlink-postgres` container is healthy. Verify that `DB_PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `ngo-backend/.env` match `docker-compose.yml`.

### 4. Missing Environment Variables
* **Error**: `Database connection failed` or `secretOrPrivateKey must have a value`.
* **Fix**: Ensure you copied `.env.example` to `.env` in `ngo-backend/` and that `JWT_SECRET` and `DATABASE_URL` are defined.
