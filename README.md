# 🏰 Urban Maharaja — Digital Loyalty Platform

> A production-ready Digital Loyalty & Review Platform for **Urban Maharaja — A Fine Dine**

## ✨ Features

### 🌐 Premium Public Website
- Royal-themed landing page with hero, menu, about, and contact pages
- Digital Maharaja Card loyalty program landing page
- Mobile-first responsive design with Playfair Display + Inter typography

### 👤 Guest Experience (Mobile-First)
- **Phone + OTP Authentication** — No password needed for guests
- **Digital Maharaja Card** — Real-time stamp progress visualization
- **Reward Tracking** — View available, redeemed, and expired rewards
- **Visit History** — Complete loyalty cycle history
- **Google Review Flow** — Tracked review CTA with click analytics
- **Profile Management** — Update name and email

### 🧑‍💼 Staff Dashboard
- **Guest Search** — Find guests by phone number
- **Stamp Approval** — Staff-verified stamp system (guests cannot self-stamp)
- **Reward Redemption** — Process reward claims at the restaurant

### 👑 Admin Dashboard
- **Analytics** — Guest growth, stamp trends, redemption charts (Recharts)
- **Guest Management** — Search, paginate, view guest details
- **Stamp Management** — Filter by status, approve/reject pending stamps
- **Reward CRUD** — Create, edit, activate/deactivate rewards
- **Redemption Management** — Track and process all redemptions
- **Restaurant Settings** — Configure restaurant info, URLs, loyalty program
- **Staff Management** — Create and manage staff accounts
- **Audit Logs** — Complete trail of all platform actions

### 🔒 Security
- JWT-based authentication with refresh tokens
- Role-based access control (GUEST / STAFF / ADMIN)
- Rate limiting (API, Auth, Operations)
- Helmet security headers
- Request ID tracing
- Input validation (express-validator)
- Transactional operations (Mongoose sessions)

## 🏗️ Architecture

```
URBAN MAHARAJA DIGITAL LOYALTY PLATFORM/
├── server/                    # Express.js Backend API
│   └── src/
│       ├── config/            # Environment, logging, database
│       ├── constants/         # Business constants & enums
│       ├── controllers/       # Thin HTTP handlers
│       ├── database/          # Seed script
│       ├── middleware/        # Auth, error handling, rate limiting, validation
│       ├── models/            # Mongoose schemas (8 models)
│       ├── routes/            # API v1 routes
│       ├── services/          # Core business logic (8 services)
│       ├── utils/             # Error hierarchy, response helpers
│       ├── validators/        # Express-validator rules
│       ├── app.js             # Express app setup
│       └── server.js          # Server entry point
├── client/                    # React + Vite Frontend
│   └── src/
│       ├── components/        # Layout, common, loyalty components
│       ├── config/            # Client configuration
│       ├── constants/         # Client-side enums
│       ├── context/           # AuthContext (React Context)
│       ├── pages/             # Public, Guest, Admin pages
│       ├── services/          # Axios API client + service layer
│       └── styles/            # Design system (Tailwind CSS v4)
└── package.json               # Root orchestration
```

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | React 19, Vite 8, Tailwind CSS v4, React Router 7 |
| UI          | Lucide React icons, Recharts, React Hot Toast  |
| Backend     | Express.js 4, Node.js                          |
| Database    | MongoDB + Mongoose 8                           |
| Auth        | JWT (access + refresh tokens), bcryptjs        |
| Security    | Helmet, CORS, express-rate-limit               |
| Validation  | express-validator                              |
| Logging     | Winston (structured JSON logging)              |

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas connection string)

### Installation

```bash
# Clone the repository
git clone https://github.com/movi062026-netizen/urban-maharaja-loyalty.git
cd urban-maharaja-loyalty

# Install all dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Configuration

```bash
# Copy and edit server environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secrets
```

### Seed Database (Development)

```bash
npm run seed
```

Demo credentials after seeding:
| Role   | Login                          | Password   |
|--------|-------------------------------|------------|
| Admin  | admin@urbanmaharaja.com       | Admin@123  |
| Staff  | staff@urbanmaharaja.com       | Staff@123  |
| Guest  | Phone: 9876543210 / OTP: 123456 (dev mode) | — |

### Run Development

```bash
# Run both server and client concurrently
npm run dev

# Or individually
npm run dev:server    # Backend on http://localhost:5000
npm run dev:client    # Frontend on http://localhost:5173
```

## 📋 API Endpoints

| Method | Endpoint                        | Auth      | Description              |
|--------|--------------------------------|-----------|--------------------------|
| POST   | `/api/v1/auth/guest/request-otp` | Public   | Request guest OTP        |
| POST   | `/api/v1/auth/guest/verify-otp`  | Public   | Verify OTP & login       |
| POST   | `/api/v1/auth/admin/login`       | Public   | Staff/Admin login        |
| GET    | `/api/v1/loyalty/cards/me`       | Guest    | Get my Maharaja Card     |
| POST   | `/api/v1/loyalty/stamps`         | Staff    | Request stamp for guest  |
| PATCH  | `/api/v1/loyalty/stamps/:id/approve` | Staff | Approve stamp          |
| GET    | `/api/v1/rewards`                | Public   | List active rewards      |
| POST   | `/api/v1/rewards/:id/redeem`     | Staff    | Redeem reward            |
| GET    | `/api/v1/admin/dashboard`        | Admin    | Dashboard stats          |
| GET    | `/api/v1/admin/analytics`        | Admin    | Analytics data           |
| GET    | `/api/v1/health`                 | Public   | Health check             |

## 🔑 Business Rules

1. **Guests cannot directly increase stamp counts** — stamps require staff approval
2. **Stamp approval is staff-side only** — no self-service stamping
3. **One stamp per visit** — enforced server-side
4. **Reward redemption requires staff verification** — guests cannot self-redeem
5. **All sensitive operations use database transactions** — data integrity guaranteed
6. **Every state change creates an audit log** — full accountability trail

## 📄 License

Private — Urban Maharaja © 2026
