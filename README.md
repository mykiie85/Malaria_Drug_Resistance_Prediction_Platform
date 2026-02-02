# 🦟 Malaria Drug Resistance Intelligence Platform

A comprehensive surveillance and ML-powered prediction platform for monitoring antimalarial drug resistance across Sub-Saharan Africa.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-green.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)
![FastAPI](https://img.shields.io/badge/fastapi-0.109+-green.svg)

## 🎯 Features

- **Real-time Surveillance Dashboard** - Interactive GIS map with resistance data across 10+ African countries
- **ML Prediction Engine** - Individual treatment failure risk assessment using ensemble models
- **Molecular Marker Tracking** - Monitor Pfkelch13, Pfcrt, Pfmdr1, and other validated resistance markers
- **Regional Analytics** - Comparative analysis across East, West, Central, and Southern Africa
- **REST API** - Full-featured API with Swagger documentation

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/malaria-resistance-platform.git
cd malaria-resistance-platform

# Start all services
docker compose up

# Access the application
# Frontend: http://localhost:5173
# API Docs: http://localhost:8000/docs
```

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/health` | GET | Health check |
| `/api/v1/reports` | GET | List country reports |
| `/api/v1/drugs` | GET | Get drug database |
| `/api/v1/markers` | GET | Get molecular markers |
| `/api/v1/dashboard/stats` | GET | Dashboard statistics |
| `/api/v1/predictions/individual` | POST | ML prediction |

## 🏗️ Tech Stack

**Backend:** FastAPI, PostgreSQL/PostGIS, Redis, Scikit-learn, XGBoost

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Leaflet, Recharts

## 📊 Data Sources

- WHO Malaria Threats Map
- MalariaGEN Molecular Surveillance
- Therapeutic Efficacy Studies (TES)

## ⚠️ Disclaimer

**This platform is intended for surveillance and research purposes only.**

It must not be used as a substitute for clinical judgment or national treatment guidelines.

## 👨‍💻 Developer

**Mike Sanga**  
📧 mykiie85@gmail.com

## 📄 License

MIT License
