# 🥗 Food Verse AI – Multimodal Food Intelligence Agent

> SmartBridge Generative AI with Google Cloud – Capstone Project

A full-stack AI-powered food intelligence dashboard featuring food recognition, nutrition analysis, freshness detection, restaurant hygiene assessment, and a personalised meal planner.

---

## ✨ Features

| Module | Description |
|---|---|
| 🔍 Food Recognition | Upload a food image; get AI-identified food name + nutrition |
| 🌿 Freshness Detection | Visual freshness score with indicators and safety notice |
| 🏪 Restaurant Hygiene | Interactive self-assessment checklist with score & recommendations |
| 📅 Meal Planner | Diet-aware, budget-conscious meal plans with shopping list |
| 🤖 Demo Mode | Pre-labelled sample data when AI credentials are not configured |

---

## 🛠 Technology Stack

- **Frontend:** React 18, Vite, React Router v6, Lucide Icons
- **Backend:** Python, FastAPI, Pydantic v2, Uvicorn
- **AI:** Google Gemini 1.5 Flash via `google-generativeai`
- **Image processing:** Pillow

---

## 📁 Project Structure

```
FoodVerseSmartBridge/
├── frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Shared UI components
│   │   ├── pages/        # Dashboard, FoodRecognition, Freshness, Hygiene, MealPlanner, About
│   │   ├── services/     # API fetch layer
│   │   └── styles/       # Global CSS design system
│   ├── .env.example
│   └── package.json
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── main.py       # Application factory
│   │   ├── config.py     # Settings from environment variables
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Gemini AI + demo data
│   │   └── schemas/      # Pydantic models
│   ├── tests/            # pytest test suite
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start (Windows)

### Prerequisites

- **Node.js** 18+ – [nodejs.org](https://nodejs.org)
- **Python** 3.11+ – [python.org](https://www.python.org/downloads/) *(check "Add to PATH")*
- **Git** – [git-scm.com](https://git-scm.com)

---

### 1 · Install frontend dependencies

```cmd
cd D:\FoodVerseSmartBridge\frontend
npm install
```

### 2 · Configure the frontend environment

```cmd
copy .env.example .env
```

Edit `.env` if you need to change the backend URL (default is `http://localhost:8000`).

---

### 3 · Set up the Python virtual environment

```cmd
cd D:\FoodVerseSmartBridge\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 4 · Configure the backend environment

```cmd
copy .env.example .env
```

Open `backend\.env` and fill in your values:

```dotenv
GOOGLE_API_KEY=your_google_api_key_here   # from https://aistudio.google.com/app/apikey
DEMO_MODE=false                            # set true to use sample data without a key
```

> **Demo Mode:** If you set `DEMO_MODE=true` (or leave `GOOGLE_API_KEY` empty) the backend returns
> clearly labelled sample data. The frontend displays a yellow **Demo Mode** banner so results are
> never confused with real AI predictions.

---

### 5 · Start the backend

Open a terminal and run:

```cmd
cd D:\FoodVerseSmartBridge\backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

API docs will be available at [http://localhost:8000/api/docs](http://localhost:8000/api/docs).

### 6 · Start the frontend

Open a **second** terminal and run:

```cmd
cd D:\FoodVerseSmartBridge\frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Backend Tests

```cmd
cd D:\FoodVerseSmartBridge\backend
venv\Scripts\activate
pytest tests/ -v
```

Tests run entirely in demo mode – no AI credentials are required.

---

## 🏗 Building the Frontend for Production

```cmd
cd D:\FoodVerseSmartBridge\frontend
npm run build
```

The compiled output is in `frontend/dist/`.

---

## 🌐 Deployment

### Frontend (Vercel / Netlify)

1. Push the repo to GitHub.
2. Connect to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set **Root Directory** to `frontend`.
4. Set the environment variable `VITE_API_BASE_URL` to your deployed backend URL.
5. Deploy.

### Backend (Render / Railway / Fly.io)

1. Connect to [Render](https://render.com) (free tier available).
2. Create a new **Web Service** pointing to the `backend` directory.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables: `GOOGLE_API_KEY`, `DEMO_MODE=false`, `ALLOWED_ORIGINS=https://your-frontend.vercel.app`

---

## 🔐 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `GOOGLE_API_KEY` | *(empty)* | Google AI Studio / Vertex AI API key |
| `GEMINI_MODEL` | `gemini-1.5-flash` | Gemini model name |
| `DEMO_MODE` | `false` | Force demo mode even if key is present |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | CORS allowed origins (comma-separated) |
| `MAX_FILE_SIZE_MB` | `10` | Maximum upload size in MB |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend base URL |
| `VITE_DEMO_MODE` | `false` | Force demo banner in UI |

---

## ⚖️ Disclaimers

- Nutrition estimates are approximate and should not replace advice from a registered dietitian.
- Freshness assessments are based on visual appearance only. Never rely on an AI image analysis to determine if food is safe to eat.
- Hygiene checklists are self-assessments for internal improvement, not official food safety certifications.
- Demo mode results are pre-defined sample data and do NOT represent real AI analysis.

---

## 📄 Licence

MIT – Educational use only.
