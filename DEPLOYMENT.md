# ResumeForge AI — Production Deployment Guide

This guide provides step-by-step instructions for deploying the **ResumeForge AI** platform in production with a separated architecture:

- **Frontend:** Next.js on **Vercel** (`https://resume-forge-ai-ats-friendly-resume.vercel.app`)
- **Backend:** FastAPI on a **Linux VPS** (Ubuntu 22.04/24.04 LTS) with **Gunicorn + UvicornWorker**, **systemd**, and **Nginx** reverse proxy with **Let's Encrypt SSL/TLS**
- **Database:** **Supabase PostgreSQL** with **Alembic** migrations
- **AI Processing:** Server-side orchestration (OpenAI, Anthropic, Gemini, Ollama, or Mock fallback) with anti-fabrication safety directives
- **Storage:** Secure filesystem or private S3 storage

---

## Architecture Overview

```text
                                USER
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     VERCEL      │
                         │ Next.js Frontend│
                         │ (Root: apps/web)│
                         └────────┬────────┘
                                  │
                                  │ HTTPS Requests
                                  ▼
                         ┌─────────────────┐
                         │  LINUX VPS / EC2│
                         │                 │
                         │  Nginx (:443)   │
                         │        ↓        │
                         │ Gunicorn (:8000)│
                         │        ↓        │
                         │ FastAPI Backend │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
              ┌──────────┐   ┌──────────┐   ┌─────────────┐
              │ Supabase │   │ AI APIs  │   │ File Storage│
              │PostgreSQL│   │OpenAI /  │   │ Private     │
              │(Database)│   │Claude /  │   │ Documents   │
              │          │   │Gemini    │   │             │
              └──────────┘   └──────────┘   └─────────────┘
```

---

## 1. Supabase PostgreSQL Configuration

1. Create a project at [https://supabase.com](https://supabase.com).
2. Navigate to **Project Settings** → **Database** → **Connection String**.
3. Select the **URI** format (or **Connection Pooling / Session mode** on port `5432` / `6543`).
4. The connection string format should be:
   ```text
   postgresql+asyncpg://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.co:5432/postgres
   ```
   *(Note: The backend automatically normalizes `postgres://` or `postgresql://` URLs to `postgresql+asyncpg://`).*
5. Keep your Supabase database password secure. Never commit it to Git or put it in the frontend environment.

---

## 2. Linux VPS Provisioning & Initial Setup

### 2.1 SSH Connection
Connect to your Ubuntu server:
```bash
ssh root@YOUR_SERVER_IP
```

### 2.2 System Package Installation
Update system packages and install necessary tools, Python 3, Nginx, Certbot, and UFW firewall:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv git nginx certbot python3-certbot-nginx ufw curl build-essential
```

### 2.3 Firewall Configuration
Configure UFW to permit SSH, HTTP, and HTTPS while keeping port 8000 and 5432 private:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP Certbot/Redirect'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable
sudo ufw status verbose
```

---

## 3. Application Deployment on VPS

### 3.1 Create System User and Directory
```bash
sudo useradd -m -s /bin/bash resumeforge || true
sudo mkdir -p /opt/resumeforge /var/log/resumeforge
sudo chown -R resumeforge:resumeforge /opt/resumeforge /var/log/resumeforge
```

### 3.2 Clone Repository
```bash
sudo -u resumeforge git clone https://github.com/Prajwal6300/ResumeForge-AI-ATS-Friendly-Resume-Optimization-Platform.git /opt/resumeforge
cd /opt/resumeforge/apps/api
```

### 3.3 Create Python Virtual Environment & Install Dependencies
```bash
sudo -u resumeforge python3 -m venv /opt/resumeforge/apps/api/.venv
sudo -u resumeforge /opt/resumeforge/apps/api/.venv/bin/pip install --upgrade pip setuptools wheel
sudo -u resumeforge /opt/resumeforge/apps/api/.venv/bin/pip install -r /opt/resumeforge/apps/api/requirements.txt
```

### 3.4 Configure Backend Environment (.env)
Copy the environment template:
```bash
sudo -u resumeforge cp /opt/resumeforge/apps/api/.env.example /opt/resumeforge/apps/api/.env
sudo -u resumeforge chmod 600 /opt/resumeforge/apps/api/.env
```

Edit `/opt/resumeforge/apps/api/.env` and configure real production secrets:
```ini
ENVIRONMENT=production
DEBUG=False
APP_NAME="ResumeForge AI"
APP_VERSION="1.0.0"
API_V1_STR="/api/v1"

# Generate with: openssl rand -hex 32
SECRET_KEY=YOUR_GENERATED_SECRET_KEY_MINIMUM_32_CHARACTERS
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256

# Supabase PostgreSQL Connection String
DATABASE_URL=postgresql+asyncpg://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.co:5432/postgres

# Production CORS Origin (exact frontend Vercel domain)
CORS_ORIGINS=https://resume-forge-ai-ats-friendly-resume.vercel.app
ALLOWED_ORIGINS=https://resume-forge-ai-ats-friendly-resume.vercel.app

# Storage
STORAGE_BACKEND=local
LOCAL_UPLOAD_DIR=/opt/resumeforge/apps/api/uploads
MAX_UPLOAD_SIZE_MB=10

# AI Configuration (OpenAI, Anthropic, Gemini, Ollama, or Mock)
DEFAULT_AI_PROVIDER=openai
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-4o-mini
# ANTHROPIC_API_KEY=
# GEMINI_API_KEY=
```

### 3.5 Run Alembic Database Migrations
Run database migrations against Supabase PostgreSQL:
```bash
cd /opt/resumeforge/apps/api
sudo -u resumeforge /opt/resumeforge/apps/api/.venv/bin/alembic upgrade head
```

---

## 4. Systemd Service Configuration

Install the systemd service unit:
```bash
sudo cp /opt/resumeforge/infrastructure/systemd/resumeforge-api.service /etc/systemd/system/resumeforge-api.service
sudo systemctl daemon-reload
sudo systemctl enable resumeforge-api
sudo systemctl start resumeforge-api
sudo systemctl status resumeforge-api
```

Check logs to verify startup:
```bash
journalctl -u resumeforge-api -n 50 --no-pager
```

---

## 5. Nginx Reverse Proxy & Let's Encrypt SSL/TLS

### 5.1 Configure Nginx
```bash
sudo cp /opt/resumeforge/infrastructure/nginx/resumeforge-api.conf /etc/nginx/sites-available/resumeforge-api.conf
```
Edit `/etc/nginx/sites-available/resumeforge-api.conf` and replace `api.yourdomain.com` with your registered backend domain.

Enable the site and verify Nginx syntax:
```bash
sudo ln -sf /etc/nginx/sites-available/resumeforge-api.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5.2 DNS Setup
In your DNS provider (Cloudflare, Namecheap, Route53, etc.), create an **A Record**:
- **Type:** `A`
- **Name:** `api` (or subdomain of choice)
- **Value / IPv4 Address:** `YOUR_SERVER_IP`
- **TTL:** Auto or 300 seconds

### 5.3 Obtain SSL Certificate with Certbot
Once DNS resolves to your server IP:
```bash
sudo certbot --nginx -d api.yourdomain.com --non-interactive --agree-tos -m admin@yourdomain.com
sudo systemctl reload nginx
```

### 5.4 Test Production Health Endpoint
```bash
curl -i https://api.yourdomain.com/health
```
Expected output:
```json
HTTP/2 200 
content-type: application/json

{"status":"healthy","app":"ResumeForge AI","version":"1.0.0","environment":"production"}
```

---

## 6. Vercel Frontend Configuration

1. Log in to [Vercel Dashboard](https://vercel.com).
2. Select your project (`ResumeForge AI` / `resume-forge-ai-ats-friendly-resume`).
3. Navigate to **Settings** → **General**:
   - **Root Directory:** `apps/web`
   - **Framework Preset:** `Next.js`
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
4. Navigate to **Settings** → **Environment Variables**:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.yourdomain.com/api/v1`
   - **Environments:** Production, Preview, Development
5. Navigate to **Deployments** → Click **Redeploy** (without cache) to rebuild the frontend with the new production API URL.

---

## 7. Operational Procedures

### 7.1 Routine Backend Update Procedure
To deploy backend updates:
```bash
cd /opt/resumeforge
sudo -u resumeforge git pull origin main
cd /opt/resumeforge/apps/api
sudo -u resumeforge /opt/resumeforge/apps/api/.venv/bin/pip install -r requirements.txt
sudo -u resumeforge /opt/resumeforge/apps/api/.venv/bin/alembic upgrade head
sudo systemctl restart resumeforge-api
sudo systemctl status resumeforge-api
```

### 7.2 Log Inspection
- **Live backend application logs:**
  ```bash
  journalctl -u resumeforge-api -f
  ```
- **Gunicorn error logs:**
  ```bash
  tail -f /var/log/resumeforge/error.log
  ```
- **Nginx access & error logs:**
  ```bash
  tail -f /var/log/nginx/resumeforge_api_access.log
  tail -f /var/log/nginx/resumeforge_api_error.log
  ```

### 7.3 Rollback Procedure
If an issue occurs after a release:
```bash
cd /opt/resumeforge
sudo -u resumeforge git checkout <PREVIOUS_STABLE_COMMIT_OR_TAG>
cd /opt/resumeforge/apps/api
# Roll back database migration if necessary:
# sudo -u resumeforge /opt/resumeforge/apps/api/.venv/bin/alembic downgrade -1
sudo systemctl restart resumeforge-api
sudo systemctl status resumeforge-api
```

---

## 8. Security & Compliance Checklist

- [x] **Zero Hardcoded Secrets:** No API keys, database passwords, or JWT secrets stored in Git.
- [x] **Frontend Isolation:** Client bundle contains only `NEXT_PUBLIC_API_URL`.
- [x] **CORS Enforcement:** FastAPI restricts requests strictly to `https://resume-forge-ai-ats-friendly-resume.vercel.app`.
- [x] **IDOR & Authorization:** Every resume, job description, analysis, suggestion, version, and export is scoped by `user_id`.
- [x] **Private Storage:** Uploaded resumes and generated documents are stored in private directories with authenticated access control.
- [x] **AI Anti-Fabrication:** Strict system prompt directives prevent fabrication of candidate metrics, dates, credentials, or skills.
- [x] **Prompt Injection Defense:** Untrusted resume and JD text are encapsulated in `<untrusted_user_input>` delimiters.
