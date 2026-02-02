"""Drug resistance reports endpoints."""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from datetime import datetime

router = APIRouter()

# Mock data directly in the file to ensure it works
COUNTRIES = [
    {
        "id": "TZ", "name": "Tanzania", "region": "east",
        "coordinates": [-6.369028, 34.888822],
        "resistanceLevel": "medium", "efficacyRate": 94.2,
        "cases2023": 8500000, "deaths2023": 24000,
        "treatmentPolicy": "AL (Artemether-Lumefantrine) as first-line ACT",
        "lastSurvey": "2023-06",
        "molecularMarkers": [
            {"name": "Pfkelch13 C580Y", "prevalence": 2.3, "trend": "stable", "significance": "validated"},
            {"name": "Pfcrt K76T", "prevalence": 15.8, "trend": "decreasing", "significance": "validated"},
            {"name": "Pfmdr1 N86Y", "prevalence": 8.2, "trend": "decreasing", "significance": "candidate"}
        ]
    },
    {
        "id": "KE", "name": "Kenya", "region": "east",
        "coordinates": [-1.286389, 36.817223],
        "resistanceLevel": "medium", "efficacyRate": 93.5,
        "cases2023": 4200000, "deaths2023": 12000,
        "treatmentPolicy": "AL as first-line, DHA-PPQ as alternative",
        "lastSurvey": "2023-09",
        "molecularMarkers": [
            {"name": "Pfkelch13 C580Y", "prevalence": 1.8, "trend": "stable", "significance": "validated"},
            {"name": "Pfcrt K76T", "prevalence": 12.4, "trend": "decreasing", "significance": "validated"},
            {"name": "Pfdhfr S108N", "prevalence": 78.5, "trend": "stable", "significance": "validated"}
        ]
    },
    {
        "id": "UG", "name": "Uganda", "region": "east",
        "coordinates": [1.373333, 32.290275],
        "resistanceLevel": "high", "efficacyRate": 89.8,
        "cases2023": 12800000, "deaths2023": 35000,
        "treatmentPolicy": "AL as first-line ACT",
        "lastSurvey": "2023-03",
        "molecularMarkers": [
            {"name": "Pfkelch13 C580Y", "prevalence": 5.2, "trend": "increasing", "significance": "validated"},
            {"name": "Pfkelch13 R539T", "prevalence": 2.1, "trend": "increasing", "significance": "validated"},
            {"name": "Pfcrt K76T", "prevalence": 22.3, "trend": "stable", "significance": "validated"}
        ]
    },
    {
        "id": "RW", "name": "Rwanda", "region": "east",
        "coordinates": [-1.940278, 29.873888],
        "resistanceLevel": "critical", "efficacyRate": 82.5,
        "cases2023": 2100000, "deaths2023": 3500,
        "treatmentPolicy": "AL first-line, monitoring intensified",
        "lastSurvey": "2023-12",
        "molecularMarkers": [
            {"name": "Pfkelch13 R561H", "prevalence": 18.5, "trend": "increasing", "significance": "validated"},
            {"name": "Pfkelch13 C580Y", "prevalence": 8.3, "trend": "increasing", "significance": "validated"},
            {"name": "Pfcrt K76T", "prevalence": 28.7, "trend": "increasing", "significance": "validated"}
        ]
    },
    {
        "id": "NG", "name": "Nigeria", "region": "west",
        "coordinates": [9.081999, 8.675277],
        "resistanceLevel": "medium", "efficacyRate": 92.8,
        "cases2023": 68000000, "deaths2023": 194000,
        "treatmentPolicy": "AL and ASAQ as first-line options",
        "lastSurvey": "2023-07",
        "molecularMarkers": [
            {"name": "Pfkelch13 C580Y", "prevalence": 0.8, "trend": "stable", "significance": "validated"},
            {"name": "Pfcrt K76T", "prevalence": 35.2, "trend": "stable", "significance": "validated"},
            {"name": "Pfmdr1 N86Y", "prevalence": 42.1, "trend": "stable", "significance": "candidate"}
        ]
    },
    {
        "id": "GH", "name": "Ghana", "region": "west",
        "coordinates": [7.946527, -1.023194],
        "resistanceLevel": "low", "efficacyRate": 96.5,
        "cases2023": 5800000, "deaths2023": 12500,
        "treatmentPolicy": "ASAQ as first-line ACT",
        "lastSurvey": "2023-05",
        "molecularMarkers": [
            {"name": "Pfkelch13 C580Y", "prevalence": 0.3, "trend": "stable", "significance": "validated"},
            {"name": "Pfcrt K76T", "prevalence": 18.9, "trend": "decreasing", "significance": "validated"}
        ]
    },
    {
        "id": "CD", "name": "DRC", "region": "central",
        "coordinates": [-4.441931, 15.266293],
        "resistanceLevel": "high", "efficacyRate": 88.2,
        "cases2023": 31000000, "deaths2023": 85000,
        "treatmentPolicy": "ASAQ as first-line ACT",
        "lastSurvey": "2022-11",
        "molecularMarkers": [
            {"name": "Pfkelch13 C580Y", "prevalence": 3.5, "trend": "increasing", "significance": "validated"},
            {"name": "Pfcrt K76T", "prevalence": 45.8, "trend": "stable", "significance": "validated"},
            {"name": "Pfdhps K540E", "prevalence": 25.3, "trend": "increasing", "significance": "validated"}
        ]
    },
    {
        "id": "MZ", "name": "Mozambique", "region": "south",
        "coordinates": [-18.665695, 35.529562],
        "resistanceLevel": "medium", "efficacyRate": 93.1,
        "cases2023": 10500000, "deaths2023": 28000,
        "treatmentPolicy": "AL as first-line ACT",
        "lastSurvey": "2023-04",
        "molecularMarkers": [
            {"name": "Pfkelch13 C580Y", "prevalence": 1.2, "trend": "stable", "significance": "validated"},
            {"name": "Pfcrt K76T", "prevalence": 19.4, "trend": "decreasing", "significance": "validated"}
        ]
    },
    {
        "id": "ET", "name": "Ethiopia", "region": "east",
        "coordinates": [9.145, 40.489673],
        "resistanceLevel": "low", "efficacyRate": 97.2,
        "cases2023": 2800000, "deaths2023": 4200,
        "treatmentPolicy": "AL for P. falciparum, CQ for P. vivax",
        "lastSurvey": "2023-08",
        "molecularMarkers": [
            {"name": "Pfkelch13 C580Y", "prevalence": 0.1, "trend": "stable", "significance": "validated"},
            {"name": "Pfcrt K76T", "prevalence": 8.5, "trend": "decreasing", "significance": "validated"}
        ]
    },
    {
        "id": "ZA", "name": "South Africa", "region": "south",
        "coordinates": [-30.559482, 22.937506],
        "resistanceLevel": "low", "efficacyRate": 98.5,
        "cases2023": 15000, "deaths2023": 45,
        "treatmentPolicy": "AL as first-line, targeting elimination",
        "lastSurvey": "2023-10",
        "molecularMarkers": [
            {"name": "Pfkelch13 C580Y", "prevalence": 0.0, "trend": "stable", "significance": "validated"},
            {"name": "Pfcrt K76T", "prevalence": 5.2, "trend": "decreasing", "significance": "validated"}
        ]
    }
]

@router.get("/reports")
async def list_reports(
    country: Optional[str] = Query(None, description="Filter by country name"),
    region: Optional[str] = Query(None, description="Filter by region: east, west, central, south"),
    resistance_level: Optional[str] = Query(None, description="Filter by level: low, medium, high, critical"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """List all drug resistance reports with optional filters."""
    reports = COUNTRIES.copy()
    
    if country:
        reports = [r for r in reports if country.lower() in r["name"].lower()]
    if region:
        reports = [r for r in reports if r["region"] == region]
    if resistance_level:
        reports = [r for r in reports if r["resistanceLevel"] == resistance_level]
    
    total = len(reports)
    reports = reports[offset:offset + limit]
    
    return {
        "reports": reports,
        "total": total,
        "page": offset // limit + 1,
        "limit": limit,
        "last_updated": datetime.utcnow().isoformat()
    }

@router.get("/reports/country/{country_id}")
async def get_report(country_id: str):
    """Get detailed report for a specific country."""
    for country in COUNTRIES:
        if country["id"] == country_id:
            return country
    raise HTTPException(status_code=404, detail="Country not found")

@router.get("/reports/region/{region}")
async def get_region_reports(region: str):
    """Get all reports for a specific region."""
    return [r for r in COUNTRIES if r["region"] == region]
