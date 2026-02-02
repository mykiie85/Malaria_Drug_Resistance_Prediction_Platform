"""Dashboard statistics endpoints."""
from fastapi import APIRouter

router = APIRouter()

REGIONS = [
    {"id": "east", "name": "East Africa", "countries": ["Tanzania", "Kenya", "Uganda", "Rwanda", "Ethiopia"], "color": "#3b82f6", "stats": {"totalCases": 30400000, "avgResistance": 23.5, "surveillanceSites": 45}},
    {"id": "west", "name": "West Africa", "countries": ["Nigeria", "Ghana", "Mali", "Burkina Faso", "Senegal"], "color": "#10b981", "stats": {"totalCases": 85000000, "avgResistance": 18.2, "surveillanceSites": 52}},
    {"id": "central", "name": "Central Africa", "countries": ["DRC", "Cameroon", "CAR", "Congo"], "color": "#f59e0b", "stats": {"totalCases": 38000000, "avgResistance": 28.7, "surveillanceSites": 23}},
    {"id": "south", "name": "Southern Africa", "countries": ["Mozambique", "South Africa", "Malawi", "Zimbabwe", "Zambia"], "color": "#8b5cf6", "stats": {"totalCases": 18000000, "avgResistance": 15.8, "surveillanceSites": 38}}
]

TREND_DATA = [
    {"year": 2019, "resistance": 12.5, "efficacy": 96.8},
    {"year": 2020, "resistance": 14.2, "efficacy": 96.2},
    {"year": 2021, "resistance": 16.8, "efficacy": 95.5},
    {"year": 2022, "resistance": 19.5, "efficacy": 94.8},
    {"year": 2023, "resistance": 22.3, "efficacy": 93.9}
]

DASHBOARD_STATS = {
    "totalCountries": 19,
    "highResistanceCount": 4,
    "avgEfficacy": 92.8,
    "activeSurveillance": 163,
    "trendData": TREND_DATA,
    "regionData": [
        {"region": "East Africa", "cases": 30400000, "resistance": 23.5},
        {"region": "West Africa", "cases": 85000000, "resistance": 18.2},
        {"region": "Central Africa", "cases": 38000000, "resistance": 28.7},
        {"region": "Southern Africa", "cases": 18000000, "resistance": 15.8}
    ],
    "markerDistribution": [
        {"marker": "Pfkelch13", "prevalence": 8.5},
        {"marker": "Pfcrt", "prevalence": 25.3},
        {"marker": "Pfmdr1", "prevalence": 18.7},
        {"marker": "Pfdhfr", "prevalence": 45.2},
        {"marker": "Pfdhps", "prevalence": 32.8}
    ]
}


@router.get("/dashboard/stats")
async def get_stats():
    """Get aggregated dashboard statistics."""
    return DASHBOARD_STATS


@router.get("/dashboard/regions")
async def get_regions():
    """Get regional breakdown data."""
    return REGIONS


@router.get("/dashboard/trends")
async def get_trends():
    """Get historical trend data."""
    return TREND_DATA