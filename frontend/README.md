# Malaria Platform - Frontend

React-based dashboard for the Malaria Drug Resistance Intelligence Platform.

## Tech Stack

- **React 19** + TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Leaflet** - GIS mapping
- **Recharts** - Data visualization
- **Framer Motion** - Animations

## Project Structure

```
src/
├── components/ui/       # shadcn/ui components
├── sections/            # Main page sections
│   ├── ReportLayer.tsx      # Surveillance dashboard
│   └── PredictionLayer.tsx  # ML prediction interface
├── services/
│   └── api.ts           # Backend API client
├── hooks/
│   └── useApi.ts        # Data fetching hooks
├── types/
│   └── index.ts         # TypeScript interfaces
├── lib/
│   └── utils.ts         # Utilities
├── malariaData.ts       # Fallback mock data
├── App.tsx              # Main component
└── main.tsx             # Entry point
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## API Integration

The frontend connects to the FastAPI backend at `VITE_API_URL` (default: `http://localhost:8000`).

When the API is unavailable, it automatically falls back to local mock data in `malariaData.ts`.

## Docker

```bash
# Development
docker build --target development -t malaria-frontend .
docker run -p 5173:5173 malaria-frontend

# Production
docker build --target production -t malaria-frontend-prod .
docker run -p 80:5173 malaria-frontend-prod
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
