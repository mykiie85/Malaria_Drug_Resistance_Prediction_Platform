"""Drug database endpoints."""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional

router = APIRouter()

DRUGS = [
    {"name": "Artemether-Lumefantrine (AL)", "type": "ACT", "firstLine": True, "efficacy2023": 94.5, "efficacy2022": 95.1, "efficacy2021": 95.8, "resistanceMarkers": ["Pfkelch13", "Pfmdr1"]},
    {"name": "Artesunate-Amodiaquine (ASAQ)", "type": "ACT", "firstLine": True, "efficacy2023": 93.8, "efficacy2022": 94.2, "efficacy2021": 94.9, "resistanceMarkers": ["Pfkelch13", "Pfcrt"]},
    {"name": "Dihydroartemisinin-Piperaquine (DHA-PPQ)", "type": "ACT", "firstLine": False, "efficacy2023": 95.2, "efficacy2022": 95.8, "efficacy2021": 96.1, "resistanceMarkers": ["Pfkelch13", "Pfplasmepsin2"]},
    {"name": "Artesunate-Mefloquine (ASMQ)", "type": "ACT", "firstLine": False, "efficacy2023": 94.1, "efficacy2022": 94.5, "efficacy2021": 95.0, "resistanceMarkers": ["Pfkelch13", "Pfmdr1"]},
    {"name": "Artesunate-Pyronaridine (Pyramax)", "type": "ACT", "firstLine": False, "efficacy2023": 96.8, "efficacy2022": 97.1, "efficacy2021": 97.5, "resistanceMarkers": ["Pfkelch13"]},
    {"name": "Sulfadoxine-Pyrimethamine (SP)", "type": "Non-ACT", "firstLine": False, "efficacy2023": 75.2, "efficacy2022": 78.5, "efficacy2021": 82.1, "resistanceMarkers": ["Pfdhfr", "Pfdhps"]},
    {"name": "Chloroquine (CQ)", "type": "Monotherapy", "firstLine": False, "efficacy2023": 45.5, "efficacy2022": 48.2, "efficacy2021": 52.0, "resistanceMarkers": ["Pfcrt"]}
]

@router.get("/drugs")
async def list_drugs(
    type: Optional[str] = Query(None, description="Filter by type: ACT, Non-ACT, Monotherapy")
):
    """List all antimalarial drugs in the database."""
    drugs = DRUGS.copy()
    if type:
        drugs = [d for d in drugs if d["type"] == type]
    return drugs

@router.get("/drugs/{drug_name}")
async def get_drug(drug_name: str):
    """Get detailed information about a specific drug."""
    for drug in DRUGS:
        if drug_name.lower() in drug["name"].lower():
            return drug
    raise HTTPException(status_code=404, detail="Drug not found")
