# 🏰 Urban Maharaja — Docker & Render Deployment Guide

This directory contains containerization files and deployment blueprints for deploying the **Urban Maharaja Royalty Platform Backend API** to **Render** and container orchestrators.

---

## 🚀 Fast Track: Deploy to Render in 3 Steps

You can deploy the backend to Render using any of the two methods below:

### Option 1: 1-Click Render Blueprint (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** ➔ **Blueprint**.
2. Select your repository: `https://github.com/movi062026-netizen/urban-maharaja-loyalty`.
3. Render will automatically detect the [`render.yaml`](../../render.yaml) file in the root.
4. Fill in the prompted environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<password>@cluster0.mongodb.net/urban-maharaja?retryWrites=true&w=majority`).
   - `CLIENT_URL`: Your frontend URL (e.g., `https://your-app.onrender.com` or `*`).
5. Click **Apply Blueprint**. Render builds the Docker image and starts the server with health checks at `/api/v1/health`!

---

### Option 2: Render Web Service via Docker GUI
1. In the Render Dashboard, click **New +** ➔ **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `urban-maharaja-api`
   - **Language / Runtime**: `Docker`
   - **Root Directory**: `server`
   - **Dockerfile Path**: `Dockerfile` (or `server/Dockerfile` if Root Directory is left blank)
   - **Branch**: `main`
   - **Plan**: `Free`
4. Under **Health Check Path**, enter:
   ```
   /api/v1/health
   ```
5. Under **Environment Variables**, add:
   | Variable | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production optimizations & validation |
   | `PORT` | `5000` | (Render will inject or expose dynamically) |
   | `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas cluster connection string |
   | `JWT_ACCESS_SECRET` | *(64-char random hex)* | Token signing key |
   | `JWT_REFRESH_SECRET` | *(64-char random hex)* | Token refresh key |
   | `JWT_ACCESS_EXPIRY` | `15m` | Token validity |
   | `JWT_REFRESH_EXPIRY` | `7d` | Refresh validity |
   | `CLIENT_URL` | `https://your-frontend-domain.com` | Allowed CORS origin |
   | `LOG_LEVEL` | `info` | Logging verbosity |

6. Click **Create Web Service**.

---

### Option 3: Standard Node.js Native Web Service (Without Docker)
If you prefer running directly on Render's native Node.js runtime without Docker:
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/v1/health`

---

## 🗄️ MongoDB Atlas Setup (Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free M0 cluster.
2. Under **Database Access**, create a database user and password.
3. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere) so Render containers can connect.
4. Copy the connection string format:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/urban-maharaja?retryWrites=true&w=majority
   ```
5. Paste this into your Render `MONGODB_URI` environment variable.

---

## 🐳 Local Docker Testing

To test the backend container locally before deploying to Render:

### Build & Run Backend Standalone:
```bash
# From the project root:
docker build -f infrastructure/docker/Dockerfile.backend -t urban-maharaja-api .

# Run with environment variables:
docker run -p 5000:5000 \
  -e NODE_ENV=development \
  -e PORT=5000 \
  -e MONGODB_URI="mongodb://host.docker.internal:27017/urban-maharaja" \
  -e CLIENT_URL="http://localhost:5173" \
  urban-maharaja-api
```

### Full Local Stack via Docker Compose:
```bash
# Starts MongoDB, Backend API, and Frontend Client:
docker compose -f infrastructure/docker/docker-compose.yml up --build -d

# View logs:
docker compose -f infrastructure/docker/docker-compose.yml logs -f backend

# Stop services:
docker compose -f infrastructure/docker/docker-compose.yml down
```

---

## 🩺 Verifying Deployment
Once deployed, verify the API is responding by visiting:
```bash
curl https://<your-render-service>.onrender.com/api/v1/health
```
Expected output:
```json
{
  "success": true,
  "message": "Urban Maharaja API is running",
  "data": {
    "uptime": 12.4,
    "timestamp": "2026-09-26T13:10:00.000Z"
  }
}
```
