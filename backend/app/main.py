"""
Malaria Drug Resistance Intelligence Platform - FastAPI Backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import routers from api/v1
from app.api.v1 import health, reports, drugs, markers, dashboard, predictions, gis


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    print("🚀 Starting Malaria Drug Resistance Platform API...")
    yield
    print("👋 Shutting down API...")


app = FastAPI(
    title="Malaria Drug Resistance Intelligence Platform",
    description="API for antimalarial drug resistance surveillance and ML predictions",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://frontend:5173",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(reports.router, prefix="/api/v1", tags=["Reports"])
app.include_router(drugs.router, prefix="/api/v1", tags=["Drugs"])
app.include_router(markers.router, prefix="/api/v1", tags=["Markers"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["Dashboard"])
app.include_router(predictions.router, prefix="/api/v1", tags=["Predictions"])
app.include_router(gis.router, prefix="/api/v1", tags=["GIS"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Malaria Drug Resistance Intelligence Platform",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)