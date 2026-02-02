"""GIS/Geospatial endpoints."""
from fastapi import APIRouter, Query
from typing import Optional
from app.db.mock_data import get_countries

router = APIRouter()

@router.get("/gis/geojson")
async def get_geojson(region: Optional[str] = Query(None)):
    """Get GeoJSON feature collection for mapping."""
    countries = get_countries()
    if region:
        countries = [c for c in countries if c["region"] == region]
    
    features = []
    for country in countries:
        features.append({
            "type": "Feature",
            "properties": {
                "country_id": country["id"],
                "country_name": country["name"],
                "resistance_level": country["resistanceLevel"],
                "efficacy_rate": country["efficacyRate"],
                "cases_2023": country["cases2023"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [country["coordinates"][1], country["coordinates"][0]]
            }
        })
    
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.get("/gis/heatmap")
async def get_heatmap(marker: Optional[str] = Query(None)):
    """Get heatmap data for resistance visualization."""
    countries = get_countries()
    points = []
    
    for country in countries:
        intensity = 0.3
        if country["resistanceLevel"] == "critical":
            intensity = 1.0
        elif country["resistanceLevel"] == "high":
            intensity = 0.75
        elif country["resistanceLevel"] == "medium":
            intensity = 0.5
        
        points.append({
            "lat": country["coordinates"][0],
            "lng": country["coordinates"][1],
            "intensity": intensity
        })
    
    return points

@router.get("/map/markers")
async def get_marker_map(
    drug: str,
    year_start: int = 2020,
    year_end: int = 2024,
    country: Optional[str] = None
):
    """Get molecular marker geographic distribution."""
    countries = get_countries()
    if country:
        countries = [c for c in countries if c["name"].lower() == country.lower()]
    
    points = []
    for c in countries:
        for marker in c.get("molecularMarkers", []):
            points.append({
                "lat": c["coordinates"][0],
                "lon": c["coordinates"][1],
                "marker": marker["name"],
                "prevalence": marker["prevalence"],
                "trend": marker["trend"],
                "year": 2023
            })
    
    return {"points": points}
