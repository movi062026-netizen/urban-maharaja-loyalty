# 🏰 Urban Maharaja — Digital Loyalty Platform

> A production-ready Digital Loyalty & Review Platform for **Urban Maharaja — A Fine Dine**

## ✨ Features

### 🌐 Premium Public Website
- Royal-themed landing page with hero, menu, about, and contact pages
- Digital Maharaja Card loyalty program landing page
- Mobile-first responsive design with Playfair Display + Inter typography

### 👤 Guest Experience (Mobile-First)
- **Google OAuth & Direct Sign-in** — Instant one-click Google authentication with patron profile sync
- **Digital Maharaja Card** — Real-time stamp progress visualization and visit history
- **Dining Bill Upload** — Upload dining receipt photos with bill number, amount, and date when requesting visits
- **Forgot Password Flow** — Secure password reset with branded transactional emails powered by **Resend**
- **Reward Tracking** — View available, unlocked, redeemed, and expired rewards
- **Visit History** — Complete loyalty cycle history with verified stamps
- **Google Review Flow** — Tracked review CTA with click analytics

### 🧑‍💼 Staff & 👑 Admin Verification Desks
- **Live Seal Queue** — Real-time requests awaiting desk approval
- **WebP Bill Inspection Lightbox** — High-resolution receipt modal with zoom and original Cloudinary link
- **Anti-Fraud Security Warnings** — Instant alerts for duplicate invoice numbers, matching image hashes, and frequency limits
- **One-Click Approval / Rejection** — Validate authentic restaurant dining receipts and credit official visit seals
- **Audit Logs & History Tables** — Stamp logs featuring customer details, dining bill thumbnails, and approving officer records
- **Analytics & Revenue Reporting** — Guest growth, stamp trends, redemption charts (Recharts)
- **Reward & Staff CRUD** — Manage rewards, access permissions, and restaurant configurations

### 🛡️ Multi-Layer Anti-Fraud Engine
1. **Invoice Number Deduplication**: Permanently locks approved receipt numbers against reuse across all patrons.
2. **Perceptual Image Hash (SHA-256)**: Detects duplicate receipt photos re-uploaded under differing names or invoice numbers.
3. **Dining Cooldown Throttling**: 4-hour cooldown between stamps for the same patron.
4. **Receipt Freshness**: Flags receipts older than 3 days or future-dated.
5. **Minimum Spend Threshold**: Flags bills below the restaurant threshold (default ₹300).
6. **Automated Fraud Risk Score (0–100)**: Visual warning badges presented directly to concierge staff.

### 🖼️ Cloudinary WebP Image Compression
- Direct server-side transcoding to **Google WebP** format.
- Perceptual quality compression (`quality: 'auto:good'`).
- Resolution bounding limit (`width: 1600, height: 2000, crop: 'limit'`) to compress multi-megapixel camera shots by 70–90%.
- EXIF metadata and privacy stripping (`flags: 'strip_profile'`).

### 🔒 Security
- JWT-based authentication with refresh tokens & HTTP-only cookies
- Google OAuth 2.0 verification
- Role-based access control (GUEST / STAFF / ADMIN)
- Rate limiting with Token Bucket algorithm & Redis integration
- Helmet security headers, CORS, and request ID tracing
- Input validation (express-validator)
- Transactional operations (Mongoose sessions)

## 🏗️ Architecture

```
URBAN MAHARAJA DIGITAL LOYALTY PLATFORM/
├── server/                    # Express.js Backend API
│   └── src/
│       ├── config/            # Environment, logging, database, Cloudinary
│       ├── constants/         # Business constants & enums
│       ├── controllers/       # Thin HTTP handlers
│       ├── integrations/      # Cloudinary storage, Resend email, Redis cache
│       ├── middleware/        # Auth, upload (multer memory), rate limiting, error handling
│       ├── models/            # Mongoose schemas (Stamp, User, Reward, etc.)
│       ├── routes/            # API v1 routes
│       ├── services/          # Core business logic (loyalty, anti-fraud, auth)
│       ├── utils/             # Error hierarchy, response helpers
│       ├── validators/        # Express-validator rules
│       ├── app.js             # Express app setup
│       └── server.js          # Server entry point
├── client/                    # React + Vite Frontend
│   └── src/
│       ├── components/        # Layout, guest stamp modal, staff queue, loyalty cards
│       ├── config/            # Client configuration
│       ├── constants/         # Client-side enums
│       ├── context/           # AuthContext (React Context)
│       ├── pages/             # Public, Guest, Staff, Admin pages
│       ├── services/          # Axios API client + service layer
│       └── styles/            # Design system (Tailwind CSS)
└── package.json               # Root orchestration
```

## 🛠️ Tech Stack

| Layer       | Technology                                            |
|-------------|------------------------------------------------------|
| Frontend    | React 19, Vite 8, Tailwind CSS, React Router 7        |
| UI          | Lucide React icons, Recharts, React Hot Toast        |
| Backend     | Express.js 4, Node.js                                |
| Database    | MongoDB + Mongoose 8                                 |
| Storage     | Cloudinary (WebP compression & streaming upload)     |
| Email       | Resend API (Transactional password reset & notices)  |
| Auth        | Google OAuth 2.0, JWT, bcryptjs                      |
| Security    | Helmet, CORS, Token Bucket Limiter, SHA-256 Hashing   |
| Logging     | Winston (structured JSON logging)                    |

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas connection string)
- **Cloudinary Account** (for bill image uploads)
- **Resend Account** (for password reset emails)

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
# Configure server environment
cp server/.env.example server/.env

# Configure client environment
cp client/.env.example client/.env
```

Key environment variables in `server/.env`:
```env
# MongoDB & JWT
MONGO_URI=mongodb://localhost:27017/urban-maharaja
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Cloudinary (WebP Bill Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend Email
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=Urban Maharaja <noreply@urbanmaharaja.com>

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
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
| Guest  | patron@example.com / Google   | User@123   |

### Run Development

```bash
# Run both server and client concurrently
npm run dev

# Or individually
npm run dev:server    # Backend on http://localhost:5000
npm run dev:client    # Frontend on http://localhost:5173
```

### Run Tests

```bash
cd server && npm run test:unit
```

## 📋 API Endpoints

| Method | Endpoint                              | Auth          | Description                          |
|--------|--------------------------------------|---------------|--------------------------------------|
| POST   | `/api/v1/auth/google`                | Public        | Google OAuth login / registration    |
| POST   | `/api/v1/auth/forgot-password`       | Public        | Send Resend password reset email     |
| POST   | `/api/v1/auth/reset-password`        | Public        | Reset password with secure token     |
| POST   | `/api/v1/auth/login`                 | Public        | Email + password login               |
| GET    | `/api/v1/loyalty/cards/me`           | Guest         | Get current Maharaja Card status     |
| POST   | `/api/v1/loyalty/stamps/request`     | Guest / Staff | Request seal with WebP bill upload   |
| PATCH  | `/api/v1/loyalty/stamps/:id/approve` | Staff / Admin | Approve seal & verify bill           |
| PATCH  | `/api/v1/loyalty/stamps/:id/reject`  | Staff / Admin | Reject seal with custom reason       |
| GET    | `/api/v1/loyalty/stamps`             | Staff / Admin | Query stamp requests & bill history  |
| GET    | `/api/v1/rewards`                    | Public        | List active rewards                  |
| POST   | `/api/v1/rewards/:id/redeem`         | Staff         | Redeem reward at restaurant          |
| GET    | `/api/v1/admin/dashboard`            | Admin         | Overview analytics & stats           |

## 🔑 Key Business Rules

1. **Guests must provide dining bill receipt** when requesting visit seals.
2. **All bill images are automatically compressed to WebP** and stripped of EXIF metadata on Cloudinary.
3. **Anti-Fraud Guardrails**: Duplicate bill numbers, identical image hashes, and multiple stamps within 4 hours are automatically blocked or flagged.
4. **Stamps require Staff or Admin verification** — guests cannot self-approve.
5. **Reward redemption requires physical staff verification** at the dining table.
6. **Every approval, rejection, and redemption creates an audit trail** for total accountability.

## 📄 License

Private — Urban Maharaja © 2026

