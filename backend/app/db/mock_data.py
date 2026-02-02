"""Mock data for development and testing."""

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

DRUGS = [
    {"name": "Artemether-Lumefantrine (AL)", "type": "ACT", "firstLine": True, "efficacy2023": 94.5, "efficacy2022": 95.1, "efficacy2021": 95.8, "resistanceMarkers": ["Pfkelch13", "Pfmdr1"]},
    {"name": "Artesunate-Amodiaquine (ASAQ)", "type": "ACT", "firstLine": True, "efficacy2023": 93.8, "efficacy2022": 94.2, "efficacy2021": 94.9, "resistanceMarkers": ["Pfkelch13", "Pfcrt"]},
    {"name": "Dihydroartemisinin-Piperaquine (DHA-PPQ)", "type": "ACT", "firstLine": False, "efficacy2023": 95.2, "efficacy2022": 95.8, "efficacy2021": 96.1, "resistanceMarkers": ["Pfkelch13", "Pfplasmepsin2"]},
    {"name": "Artesunate-Mefloquine (ASMQ)", "type": "ACT", "firstLine": False, "efficacy2023": 94.1, "efficacy2022": 94.5, "efficacy2021": 95.0, "resistanceMarkers": ["Pfkelch13", "Pfmdr1"]},
    {"name": "Artesunate-Pyronaridine (Pyramax)", "type": "ACT", "firstLine": False, "efficacy2023": 96.8, "efficacy2022": 97.1, "efficacy2021": 97.5, "resistanceMarkers": ["Pfkelch13"]},
    {"name": "Sulfadoxine-Pyrimethamine (SP)", "type": "Non-ACT", "firstLine": False, "efficacy2023": 75.2, "efficacy2022": 78.5, "efficacy2021": 82.1, "resistanceMarkers": ["Pfdhfr", "Pfdhps"]},
    {"name": "Chloroquine (CQ)", "type": "Monotherapy", "firstLine": False, "efficacy2023": 45.5, "efficacy2022": 48.2, "efficacy2021": 52.0, "resistanceMarkers": ["Pfcrt"]}
]

REGIONS = [
    {"id": "east", "name": "East Africa", "countries": ["Tanzania", "Kenya", "Uganda", "Rwanda", "Ethiopia"], "color": "#3b82f6", "stats": {"totalCases": 30400000, "avgResistance": 23.5, "surveillanceSites": 45}},
    {"id": "west", "name": "West Africa", "countries": ["Nigeria", "Ghana", "Mali", "Burkina Faso", "Senegal"], "color": "#10b981", "stats": {"totalCases": 85000000, "avgResistance": 18.2, "surveillanceSites": 52}},
    {"id": "central", "name": "Central Africa", "countries": ["DRC", "Cameroon", "CAR", "Congo"], "color": "#f59e0b", "stats": {"totalCases": 38000000, "avgResistance": 28.7, "surveillanceSites": 23}},
    {"id": "south", "name": "Southern Africa", "countries": ["Mozambique", "South Africa", "Malawi", "Zimbabwe", "Zambia"], "color": "#8b5cf6", "stats": {"totalCases": 18000000, "avgResistance": 15.8, "surveillanceSites": 38}}
]

def get_countries():
    return COUNTRIES

def get_country_by_id(country_id: str):
    for c in COUNTRIES:
        if c["id"] == country_id:
            return c
    return None

def get_drugs():
    return DRUGS

def get_drug_by_name(name: str):
    for d in DRUGS:
        if name.lower() in d["name"].lower():
            return d
    return None

def get_region_data():
    return REGIONS

def get_trend_data():
    return [
        {"year": 2019, "resistance": 12.5, "efficacy": 96.8},
        {"year": 2020, "resistance": 14.2, "efficacy": 96.2},
        {"year": 2021, "resistance": 16.8, "efficacy": 95.5},
        {"year": 2022, "resistance": 19.5, "efficacy": 94.8},
        {"year": 2023, "resistance": 22.3, "efficacy": 93.9}
    ]

def get_dashboard_stats():
    return {
        "totalCountries": 19,
        "highResistanceCount": 4,
        "avgEfficacy": 92.8,
        "activeSurveillance": 163,
        "trendData": get_trend_data(),
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
