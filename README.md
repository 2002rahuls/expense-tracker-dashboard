# Expense Tracker Dashboard

Full-stack expense tracking application using Django (backend) and Next.js (frontend).

---

## Architecture

- **Backend:** Django REST Framework API
- **Frontend:** Next.js (App Router)
- **Database:** PostgreSQL (Supabase recommended)
- **Backend Deployment:** Google Cloud Run
- **Frontend Deployment:** Vercel

---

## Project Structure

```
expense-tracker-dashboard/
├── backend/
│   ├── config/
│   ├── expenses/
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   └── src/
└── README.md
```

---

## Development Setup

### 1. Backend Setup (Django)

```
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell
pip install -r requirements.txt
```

Create `.env` file:

```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
NEWS_API_KEY=your-news-api-key
```

Run migrations and start server:

```
python manage.py migrate
python manage.py runserver
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

### 2. Frontend Setup (Next.js)

```
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Environment Variables

### Backend (.env)

```
DEBUG=True or False
SECRET_KEY=your-secret
DATABASE_URL=postgresql://user:password@host:port/dbname
NEWS_API_KEY=your-news-api-key
```

When `DATABASE_URL` is present, the app uses PostgreSQL via `dj-database-url`.
If not provided, SQLite is used locally.

---

## Features

- Full CRUD operations on expenses
- Category-wise expense visualization (Pie Chart)
- Monthly expense trends (Bar Chart)
- Live USD conversion via third-party API
- Technology/Education headlines integration via thirds-party API
- Client-side demo authentication gate (admin/admin)

---

## Production Deployment

---

# Backend Deployment (Google Cloud Run)

All commands must be run from:

```
expense-tracker-dashboard/backend
```

---

### 1. Enable Required Services

```
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

---

### 2. Build Container

```
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/expense-backend
```

---

### 3. Deploy to Cloud Run

```
gcloud run deploy expense-backend \
  --image gcr.io/YOUR_PROJECT_ID/expense-backend \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="postgresql://...",SECRET_KEY="your-secret",NEWS_API_KEY="your-key",DEBUG=False
```

After deployment, Cloud Run will provide a URL:

```
https://expense-backend-xxxxx-uc.a.run.app
```

---

### 4. Run Database Migrations

From backend directory (locally, pointing to production DB):

```
python manage.py migrate
```

Then redeploy container.

---

## Backend Dockerfile (Production)

```
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8080"]
```

---

# Frontend Deployment (Vercel)

1. Import GitHub repository
2. Set **Root Directory** to:

```
frontend
```

3. Ensure framework is detected as:

```
Next.js
```

4. Add Environment Variable:

```
NEXT_PUBLIC_API_URL=https://your-cloud-run-url/api/
```

5. Deploy

---

## Testing Checklist (Production)

- Access `/api/expenses/` and verify JSON response
- Create, update, delete expenses from frontend
- Verify data updates in Supabase
- Confirm dashboard charts update dynamically
- Confirm USD conversion works
- Confirm headlines load correctly

---

## Notes

- Static files are handled using `whitenoise`
- PostgreSQL is recommended for production
- SQLite is used only for local development
- The demo authentication is client-side only and not secure for production

---

## API Endpoints

```
GET    /api/expenses/
POST   /api/expenses/
GET    /api/expenses/{id}/
PUT    /api/expenses/{id}/
DELETE /api/expenses/{id}/

GET    /api/currency-rate/
GET    /api/news/
```

---

## Tech Stack

- Django 5.x
- Django REST Framework
- PostgreSQL
- Supabase
- Next.js (App Router)
- Recharts
- Google Cloud Run
- Vercel
