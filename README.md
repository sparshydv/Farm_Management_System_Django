# FarmFlow — Farm Management System

Modern farm management platform with a Django backend and a React + TypeScript frontend.

## Overview

This project helps farmers manage end-to-end operations from a single system:

- Employees
- Crops (with expenses, sales, and operations)
- Livestock (with production logs)
- Machinery (with activities and maintenance)
- Milk production
- Egg production

The backend provides REST APIs (Django REST Framework), and the frontend is a Vite-based React app.

## Tech Stack

### Backend

- Django 5.0
- Django REST Framework
- SQLite (default)
- django-cors-headers
- WhiteNoise (static file serving)

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React

## Architecture

- Django app serves APIs under:
  - `/api/auth/*`
  - `/api/*`
- React frontend runs separately (dev server on `5173`) and calls backend through Vite proxy.
- Session-based authentication is used for login/logout/me.

## Project Structure

```text
Farm_Management_System_Django/
├── backend/                     # Django API server
│   ├── manage.py
│   ├── requirements.txt
│   ├── procfile
│   ├── .env.example
│   ├── FarmManagementSystem/    # Django project settings/urls
│   ├── authentication/          # Auth API app
│   ├── homepage/                # Core farm domain app + APIs
│   └── static/
├── frontend/                    # React + TypeScript + Vite app
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── vercel.json
├── .gitignore
└── README.md
```

## Implemented Features

### Public + Auth

- Landing page (`/`)
- Register
- Login
- Google OAuth login
- Logout
- Current user (`/api/auth/me/`)

### Dashboard & Modules

- Dashboard overview
- Employees CRUD
- Crops CRUD
  - Crop expenses CRUD
  - Crop sales CRUD
  - Crop operations CRUD
- Livestock CRUD
  - Livestock production CRUD
- Machinery CRUD
  - Machinery activities CRUD
  - Machinery maintenance CRUD
- Milk production CRUD + monthly summary endpoint
- Egg production CRUD + monthly summary endpoint

## API Endpoints

### Authentication

- `GET /api/auth/csrf/`
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/google/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`

### Core Resources

- `GET/POST /api/employees/`
- `GET/PUT/PATCH/DELETE /api/employees/{id}/`

- `GET/POST /api/crops/`
- `GET/PUT/PATCH/DELETE /api/crops/{id}/`
- `GET/POST /api/crops/{Cid}/expenses/`
- `GET/PUT/PATCH/DELETE /api/crops/{Cid}/expenses/{id}/`
- `GET/POST /api/crops/{Cid}/sales/`
- `GET/PUT/PATCH/DELETE /api/crops/{Cid}/sales/{id}/`
- `GET/POST /api/crops/{Cid}/operations/`
- `GET/PUT/PATCH/DELETE /api/crops/{Cid}/operations/{id}/`

- `GET/POST /api/livestock/`
- `GET/PUT/PATCH/DELETE /api/livestock/{id}/`
- `GET/POST /api/livestock/{Tag_number}/production/`
- `GET/PUT/PATCH/DELETE /api/livestock/{Tag_number}/production/{id}/`

- `GET/POST /api/machinery/`
- `GET/PUT/PATCH/DELETE /api/machinery/{Number_plate}/`
- `GET/POST /api/machinery/{Number_plate}/activities/`
- `GET/PUT/PATCH/DELETE /api/machinery/{Number_plate}/activities/{id}/`
- `GET/POST /api/machinery/{Number_plate}/maintenance/`
- `GET/PUT/PATCH/DELETE /api/machinery/{Number_plate}/maintenance/{id}/`

- `GET/POST /api/milk-production/`
- `GET/PUT/PATCH/DELETE /api/milk-production/{id}/`
- `GET /api/milk-production/summary/`

- `GET/POST /api/egg-production/`
- `GET/PUT/PATCH/DELETE /api/egg-production/{id}/`
- `GET /api/egg-production/summary/`

## Local Development Setup

### 1) Clone and enter the project

```bash
git clone https://github.com/sparshydv/Farm_Management_System_Django.git
cd Farm_Management_System_Django
```

### 2) Backend setup

Create and activate virtual environment:

### Windows (PowerShell)

```bash
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Move into backend, install dependencies, and migrate:

```bash
cd backend
pip install -r requirements.txt
py manage.py migrate
```

(Optional) create admin user:

```bash
py manage.py createsuperuser
```

Run backend server:

```bash
py manage.py runserver 8000
```

Backend URL:

- `http://127.0.0.1:8000/`

### 3) Frontend setup

In another terminal (from repo root):

```bash
cd frontend
npm install
npm run dev -- --host
```

For Google OAuth in local/dev, set:

- `frontend/.env` with `VITE_GOOGLE_CLIENT_ID=...`
- `backend/.env` (or platform env vars) with `GOOGLE_CLIENT_ID=...`

You can keep multiple backend client IDs comma-separated in `GOOGLE_CLIENT_ID`.

Frontend URL:

- `http://localhost:5173/`

Build frontend:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Configuration Notes

- Vite dev server proxies `/api` to `http://127.0.0.1:8000`.
- Frontend can target deployed backend using `VITE_API_BASE_URL`.
- CORS is enabled for:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- CSRF trusted origins include those same frontend origins for authenticated POST/PUT/PATCH/DELETE requests.

## Production Deployment

Recommended setup:

- Frontend: Vercel
- Backend: Render (Web Service + PostgreSQL)

### Why Render for backend?

- Very straightforward Django + Gunicorn deployment
- Managed PostgreSQL available in same platform
- Easy environment variable management

### 1) Deploy backend on Render

Create a new Web Service pointing to this repository.

Set Render Root Directory to `backend`.

Render settings:

- Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- Start Command: `gunicorn FarmManagementSystem.wsgi --log-file -`

Set these environment variables on Render:

- `DJANGO_SECRET_KEY` = a strong random value
- `DJANGO_DEBUG` = `False`
- `DJANGO_ALLOWED_HOSTS` = `your-backend.onrender.com`
- `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`
- `CSRF_TRUSTED_ORIGINS` = `https://your-frontend.vercel.app`
- `DATABASE_URL` = Render PostgreSQL connection string

Then run migrations once (Render shell/console):

```bash
python manage.py migrate
```

### 2) Deploy frontend on Vercel

Import `frontend/` as the project root in Vercel.

Set environment variable in Vercel:

- `VITE_API_BASE_URL` = `https://your-backend.onrender.com`

Build settings:

- Install: `npm install`
- Build: `npm run build`
- Output: `dist`

`frontend/vercel.json` is already included for SPA routing.

### 3) Final cross-origin checklist

- Backend CORS origin matches your Vercel domain exactly.
- Backend CSRF trusted origin matches your Vercel domain exactly.
- Frontend `VITE_API_BASE_URL` points to backend `https` URL.

## Useful Commands

Run backend tests:

```bash
cd backend
py manage.py test
```

Collect static files:

```bash
cd backend
py manage.py collectstatic
```

## Current Gaps / Next Improvements

- Automated tests for API and frontend flows
- Role-based permissions (admin/manager/staff)
- Data export (CSV/PDF reports)
- Password reset/change flows
- Audit logs and notifications

## Author

Developed by Sparsh Yadav.

---

If you use this project in production, update security settings (secret key, debug, allowed hosts, HTTPS, and cookie settings) before deployment.
