"""Molecular markers endpoints."""
from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

MARKERS = [
    {"name": "Pfkelch13 C580Y", "description": "Primary artemisinin resistance marker", "category": "Artemisinin", "associated_drugs": ["AL", "ASAQ", "DHA-PPQ"], "clinical_significance": "Strong association with delayed parasite clearance"},
    {"name": "Pfkelch13 R539T", "description": "Artemisinin resistance marker (SEA origin)", "category": "Artemisinin", "associated_drugs": ["AL", "ASAQ"], "clinical_significance": "Validated resistance marker"},
    {"name": "Pfkelch13 Y493H", "description": "Artemisinin resistance marker", "category": "Artemisinin", "associated_drugs": ["AL", "ASAQ"], "clinical_significance": "Validated resistance marker"},
    {"name": "Pfkelch13 R561H", "description": "African artemisinin resistance marker", "category": "Artemisinin", "associated_drugs": ["AL", "ASAQ"], "clinical_significance": "Emerging in East Africa"},
    {"name": "Pfcrt K76T", "description": "Chloroquine resistance marker", "category": "Partner Drug", "associated_drugs": ["CQ", "AQ"], "clinical_significance": "Primary CQ resistance determinant"},
    {"name": "Pfmdr1 N86Y", "description": "Multidrug resistance marker", "category": "Partner Drug", "associated_drugs": ["AL", "MQ"], "clinical_significance": "Modulates response to multiple drugs"},
    {"name": "Pfmdr1 Y184F", "description": "Multidrug resistance marker", "category": "Partner Drug", "associated_drugs": ["AL", "MQ"], "clinical_significance": "Associated with altered drug sensitivity"},
    {"name": "Pfdhfr N51I", "description": "Pyrimethamine resistance marker", "category": "SP", "associated_drugs": ["SP"], "clinical_significance": "Part of quintuple mutant"},
    {"name": "Pfdhfr C59R", "description": "Pyrimethamine resistance marker", "category": "SP", "associated_drugs": ["SP"], "clinical_significance": "Part of quintuple mutant"},
    {"name": "Pfdhfr S108N", "description": "Pyrimethamine resistance marker", "category": "SP", "associated_drugs": ["SP"], "clinical_significance": "Core SP resistance mutation"},
    {"name": "Pfdhps A437G", "description": "Sulfadoxine resistance marker", "category": "SP", "associated_drugs": ["SP"], "clinical_significance": "Part of quintuple mutant"},
    {"name": "Pfdhps K540E", "description": "Sulfadoxine resistance marker", "category": "SP", "associated_drugs": ["SP"], "clinical_significance": "Associated with SP failure in East Africa"},
]

@router.get("/markers")
async def list_markers(
    category: Optional[str] = Query(None, description="Filter by category: Artemisinin, Partner Drug, SP")
):
    """List all molecular markers tracked by the platform."""
    markers = MARKERS.copy()
    if category:
        markers = [m for m in markers if m["category"] == category]
    return markers

@router.get("/markers/{marker_name}")
async def get_marker(marker_name: str):
    """Get detailed information about a specific marker."""
    for marker in MARKERS:
        if marker["name"] == marker_name:
            return marker
    return {"error": "Marker not found"}
