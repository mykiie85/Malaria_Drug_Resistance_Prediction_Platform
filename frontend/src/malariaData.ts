import type { CountryData, DrugData, DashboardStats, RegionInfo, PredictionResult } from '@/types';

export const africanCountries: CountryData[] = [
  // East Africa
  {
    id: 'UG',
    name: 'Uganda',
    region: 'east',
    coordinates: [1.3733, 32.2903],
    resistanceLevel: 'high',
    efficacyRate: 87.5,
    molecularMarkers: [
      { name: 'Pfkelch13 R561H', prevalence: 52, trend: 'increasing', significance: 'validated' },
      { name: 'Pfkelch13 C469Y', prevalence: 59, trend: 'increasing', significance: 'validated' },
      { name: 'Pfkelch13 P441L', prevalence: 69, trend: 'increasing', significance: 'candidate' },
      { name: 'Pfcrt K76T', prevalence: 38, trend: 'stable', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 35, trend: 'decreasing', significance: 'validated' },
    ],
    cases2023: 13800000,
    deaths2023: 4500,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line), Artesunate-Amodiaquine (Alternative)',
    lastSurvey: '2023',
  },
  {
    id: 'KE',
    name: 'Kenya',
    region: 'east',
    coordinates: [-0.0236, 37.9062],
    resistanceLevel: 'high',
    efficacyRate: 89.2,
    molecularMarkers: [
      { name: 'Pfkelch13 R561H', prevalence: 28, trend: 'increasing', significance: 'validated' },
      { name: 'Pfkelch13 A675V', prevalence: 15, trend: 'increasing', significance: 'validated' },
      { name: 'Pfcrt K76T', prevalence: 42, trend: 'stable', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 48, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 8900000,
    deaths2023: 3200,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2023',
  },
  {
    id: 'TZ',
    name: 'Tanzania',
    region: 'east',
    coordinates: [-6.3690, 34.8888],
    resistanceLevel: 'medium',
    efficacyRate: 92.3,
    molecularMarkers: [
      { name: 'Pfkelch13 P441L', prevalence: 20, trend: 'increasing', significance: 'candidate' },
      { name: 'Pfkelch13 R622I', prevalence: 12, trend: 'stable', significance: 'validated' },
      { name: 'Pfcrt K76T', prevalence: 32, trend: 'decreasing', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 28, trend: 'decreasing', significance: 'validated' },
    ],
    cases2023: 11200000,
    deaths2023: 6800,
    treatmentPolicy: 'Artesunate-Amodiaquine (First-line), Artemether-Lumefantrine (Alternative)',
    lastSurvey: '2023',
  },
  {
    id: 'RW',
    name: 'Rwanda',
    region: 'east',
    coordinates: [-1.9403, 29.8739],
    resistanceLevel: 'high',
    efficacyRate: 88.7,
    molecularMarkers: [
      { name: 'Pfkelch13 C469F', prevalence: 36, trend: 'increasing', significance: 'candidate' },
      { name: 'Pfkelch13 R561H', prevalence: 22, trend: 'increasing', significance: 'validated' },
      { name: 'Pfcrt K76T', prevalence: 45, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 2100000,
    deaths2023: 890,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2023',
  },
  {
    id: 'ET',
    name: 'Ethiopia',
    region: 'east',
    coordinates: [9.1450, 40.4897],
    resistanceLevel: 'medium',
    efficacyRate: 94.1,
    molecularMarkers: [
      { name: 'Pfkelch13 R622I', prevalence: 8, trend: 'stable', significance: 'validated' },
      { name: 'Pfcrt K76T', prevalence: 25, trend: 'decreasing', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 22, trend: 'decreasing', significance: 'validated' },
    ],
    cases2023: 3200000,
    deaths2023: 1200,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2022',
  },
  {
    id: 'ER',
    name: 'Eritrea',
    region: 'east',
    coordinates: [15.1794, 39.7823],
    resistanceLevel: 'high',
    efficacyRate: 86.4,
    molecularMarkers: [
      { name: 'Pfkelch13 R622I', prevalence: 68, trend: 'increasing', significance: 'validated' },
      { name: 'Pfcrt K76T', prevalence: 55, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 180000,
    deaths2023: 45,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2022',
  },
  // West Africa
  {
    id: 'NG',
    name: 'Nigeria',
    region: 'west',
    coordinates: [9.0820, 8.6753],
    resistanceLevel: 'medium',
    efficacyRate: 93.5,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 48, trend: 'stable', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 52, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhfr S108N', prevalence: 85, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhps A437G', prevalence: 72, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 68000000,
    deaths2023: 18900,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line), Artesunate-Amodiaquine (Alternative)',
    lastSurvey: '2023',
  },
  {
    id: 'GH',
    name: 'Ghana',
    region: 'west',
    coordinates: [7.9465, -1.0232],
    resistanceLevel: 'medium',
    efficacyRate: 94.2,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 42, trend: 'decreasing', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 45, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhfr S108N', prevalence: 88, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 5800000,
    deaths2023: 1200,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2023',
  },
  {
    id: 'BF',
    name: 'Burkina Faso',
    region: 'west',
    coordinates: [12.2383, -1.5616],
    resistanceLevel: 'medium',
    efficacyRate: 92.8,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 38, trend: 'stable', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 48, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhfr S108N', prevalence: 82, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 9200000,
    deaths2023: 2800,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2022',
  },
  {
    id: 'ML',
    name: 'Mali',
    region: 'west',
    coordinates: [17.5707, -3.9962],
    resistanceLevel: 'medium',
    efficacyRate: 93.1,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 35, trend: 'stable', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 42, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhfr S108N', prevalence: 78, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 7800000,
    deaths2023: 3100,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2022',
  },
  {
    id: 'SN',
    name: 'Senegal',
    region: 'west',
    coordinates: [14.4974, -14.4524],
    resistanceLevel: 'low',
    efficacyRate: 96.2,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 28, trend: 'decreasing', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 35, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhfr S108N', prevalence: 65, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 1200000,
    deaths2023: 280,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2023',
  },
  // Central Africa
  {
    id: 'CD',
    name: 'DR Congo',
    region: 'central',
    coordinates: [-4.0383, 21.7587],
    resistanceLevel: 'high',
    efficacyRate: 88.9,
    molecularMarkers: [
      { name: 'Pfkelch13 R561H', prevalence: 18, trend: 'increasing', significance: 'validated' },
      { name: 'Pfcrt K76T', prevalence: 52, trend: 'stable', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 58, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhfr S108N', prevalence: 75, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 28000000,
    deaths2023: 15200,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line), Artesunate-Amodiaquine (Alternative)',
    lastSurvey: '2023',
  },
  {
    id: 'CM',
    name: 'Cameroon',
    region: 'central',
    coordinates: [7.3697, 12.3547],
    resistanceLevel: 'medium',
    efficacyRate: 91.5,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 45, trend: 'stable', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 48, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhfr S108N', prevalence: 80, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 3200000,
    deaths2023: 890,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2022',
  },
  {
    id: 'CF',
    name: 'Central African Republic',
    region: 'central',
    coordinates: [6.6111, 20.9394],
    resistanceLevel: 'medium',
    efficacyRate: 90.8,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 48, trend: 'stable', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 52, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 1800000,
    deaths2023: 720,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2021',
  },
  {
    id: 'GA',
    name: 'Gabon',
    region: 'central',
    coordinates: [-0.8037, 11.6094],
    resistanceLevel: 'medium',
    efficacyRate: 92.4,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 42, trend: 'stable', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 45, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 280000,
    deaths2023: 85,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2022',
  },
  // Southern Africa
  {
    id: 'MZ',
    name: 'Mozambique',
    region: 'south',
    coordinates: [-18.6657, 35.5296],
    resistanceLevel: 'medium',
    efficacyRate: 93.8,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 38, trend: 'decreasing', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 42, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhfr S108N', prevalence: 72, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 9800000,
    deaths2023: 2400,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2023',
  },
  {
    id: 'ZM',
    name: 'Zambia',
    region: 'south',
    coordinates: [-13.1339, 27.8493],
    resistanceLevel: 'low',
    efficacyRate: 95.2,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 32, trend: 'decreasing', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 38, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhfr S108N', prevalence: 68, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 5200000,
    deaths2023: 1200,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2023',
  },
  {
    id: 'MW',
    name: 'Malawi',
    region: 'south',
    coordinates: [-13.2543, 34.3015],
    resistanceLevel: 'low',
    efficacyRate: 94.6,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 35, trend: 'decreasing', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 40, trend: 'stable', significance: 'validated' },
      { name: 'Pfdhfr S108N', prevalence: 70, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 4200000,
    deaths2023: 980,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2023',
  },
  {
    id: 'AO',
    name: 'Angola',
    region: 'south',
    coordinates: [-11.2027, 17.8739],
    resistanceLevel: 'high',
    efficacyRate: 87.2,
    molecularMarkers: [
      { name: 'Pfkelch13 R561H', prevalence: 15, trend: 'increasing', significance: 'validated' },
      { name: 'Pfcrt K76T', prevalence: 55, trend: 'stable', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 62, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 7800000,
    deaths2023: 3200,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2022',
  },
  {
    id: 'ZW',
    name: 'Zimbabwe',
    region: 'south',
    coordinates: [-19.0154, 29.1549],
    resistanceLevel: 'low',
    efficacyRate: 95.8,
    molecularMarkers: [
      { name: 'Pfcrt K76T', prevalence: 28, trend: 'decreasing', significance: 'validated' },
      { name: 'Pfmdr1 N86Y', prevalence: 35, trend: 'stable', significance: 'validated' },
    ],
    cases2023: 580000,
    deaths2023: 120,
    treatmentPolicy: 'Artemether-Lumefantrine (First-line)',
    lastSurvey: '2022',
  },
];

export const drugDatabase: DrugData[] = [
  {
    name: 'Artemether-Lumefantrine (AL)',
    type: 'ACT',
    firstLine: true,
    efficacy2023: 91.2,
    efficacy2022: 92.5,
    efficacy2021: 93.8,
    resistanceMarkers: ['Pfmdr1 N86', 'Pfmdr1 D1246', 'Pfcrt K76'],
  },
  {
    name: 'Artesunate-Amodiaquine (ASAQ)',
    type: 'ACT',
    firstLine: true,
    efficacy2023: 93.5,
    efficacy2022: 94.1,
    efficacy2021: 94.8,
    resistanceMarkers: ['Pfmdr1 86Y', 'Pfmdr1 1246Y', 'Pfcrt 76T'],
  },
  {
    name: 'Dihydroartemisinin-Piperaquine (DHA-PPQ)',
    type: 'ACT',
    firstLine: false,
    efficacy2023: 95.2,
    efficacy2022: 95.8,
    efficacy2021: 96.1,
    resistanceMarkers: ['Pfplasmepsin2-3 CNV', 'Pfcrt K76'],
  },
  {
    name: 'Artesunate-Mefloquine (ASMQ)',
    type: 'ACT',
    firstLine: false,
    efficacy2023: 94.8,
    efficacy2022: 95.2,
    efficacy2021: 95.5,
    resistanceMarkers: ['Pfmdr1 CNV', 'Pfcrt K76'],
  },
  {
    name: 'Artesunate-Pyronaridine (ASPY)',
    type: 'ACT',
    firstLine: false,
    efficacy2023: 96.5,
    efficacy2022: 96.8,
    efficacy2021: 97.1,
    resistanceMarkers: ['Pfmdr1 N86', 'Pfcrt K76'],
  },
  {
    name: 'Chloroquine (CQ)',
    type: 'Monotherapy',
    firstLine: false,
    efficacy2023: 45.2,
    efficacy2022: 44.8,
    efficacy2021: 44.5,
    resistanceMarkers: ['Pfcrt 76T', 'Pfcrt 72-76'],
  },
  {
    name: 'Sulfadoxine-Pyrimethamine (SP)',
    type: 'Non-ACT',
    firstLine: false,
    efficacy2023: 38.5,
    efficacy2022: 38.2,
    efficacy2021: 37.8,
    resistanceMarkers: ['Pfdhfr S108N', 'Pfdhfr C59R', 'Pfdhps A437G', 'Pfdhps K540E'],
  },
];

export const regionData: RegionInfo[] = [
  {
    id: 'east',
    name: 'East Africa',
    countries: ['Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'Ethiopia', 'Eritrea'],
    color: '#3b82f6',
    stats: {
      totalCases: 39480000,
      avgResistance: 42.5,
      surveillanceSites: 48,
    },
  },
  {
    id: 'west',
    name: 'West Africa',
    countries: ['Nigeria', 'Ghana', 'Burkina Faso', 'Mali', 'Senegal'],
    color: '#10b981',
    stats: {
      totalCases: 89900000,
      avgResistance: 38.2,
      surveillanceSites: 52,
    },
  },
  {
    id: 'central',
    name: 'Central Africa',
    countries: ['DR Congo', 'Cameroon', 'Central African Republic', 'Gabon'],
    color: '#f59e0b',
    stats: {
      totalCases: 32880000,
      avgResistance: 45.8,
      surveillanceSites: 28,
    },
  },
  {
    id: 'south',
    name: 'Southern Africa',
    countries: ['Mozambique', 'Zambia', 'Malawi', 'Angola', 'Zimbabwe'],
    color: '#8b5cf6',
    stats: {
      totalCases: 27580000,
      avgResistance: 35.4,
      surveillanceSites: 35,
    },
  },
];

export const dashboardStats: DashboardStats = {
  totalCountries: 19,
  highResistanceCount: 6,
  avgEfficacy: 91.8,
  activeSurveillance: 163,
  trendData: [
    { year: 2019, resistance: 28.5, efficacy: 95.2 },
    { year: 2020, resistance: 31.2, efficacy: 94.5 },
    { year: 2021, resistance: 34.8, efficacy: 93.8 },
    { year: 2022, resistance: 38.5, efficacy: 92.5 },
    { year: 2023, resistance: 42.3, efficacy: 91.2 },
  ],
  regionData: [
    { region: 'East Africa', cases: 39480000, resistance: 42.5 },
    { region: 'West Africa', cases: 89900000, resistance: 38.2 },
    { region: 'Central Africa', cases: 32880000, resistance: 45.8 },
    { region: 'Southern Africa', cases: 27580000, resistance: 35.4 },
  ],
  markerDistribution: [
    { marker: 'Pfcrt K76T', prevalence: 42.5 },
    { marker: 'Pfmdr1 N86Y', prevalence: 44.2 },
    { marker: 'Pfdhfr S108N', prevalence: 76.8 },
    { marker: 'Pfdhps A437G', prevalence: 68.5 },
    { marker: 'Pfkelch13 R561H', prevalence: 18.5 },
    { marker: 'Pfkelch13 C469Y', prevalence: 15.2 },
  ],
};

export const generatePrediction = (input: {
  drugName: string;
  country: string;
  region: string;
  previousTreatments: number;
  patientAge: number;
  molecularMarkers: string[];
}): PredictionResult => {
  const countryData = africanCountries.find(c => c.name === input.country);
  const drugData = drugDatabase.find(d => d.name === input.drugName);
  
  let baseProbability = 15;
  
  // Factor in country resistance level
  if (countryData) {
    if (countryData.resistanceLevel === 'critical') baseProbability += 35;
    else if (countryData.resistanceLevel === 'high') baseProbability += 25;
    else if (countryData.resistanceLevel === 'medium') baseProbability += 15;
    else baseProbability += 5;
  }
  
  // Factor in previous treatments
  baseProbability += input.previousTreatments * 8;
  
  // Factor in molecular markers
  baseProbability += input.molecularMarkers.length * 5;
  
  // Factor in drug efficacy decline
  if (drugData) {
    const efficacyDecline = drugData.efficacy2021 - drugData.efficacy2023;
    baseProbability += efficacyDecline * 2;
  }
  
  // Cap probability
  const resistanceProbability = Math.min(Math.max(baseProbability, 5), 95);
  
  // Generate timeline
  const timeline = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    probability: Math.min(resistanceProbability + i * 1.5, 95),
  }));
  
  // Generate geo risk
  const geoRisk = regionData.map(r => ({
    region: r.name,
    risk: r.stats.avgResistance * (1 + Math.random() * 0.3),
  })).sort((a, b) => b.risk - a.risk);
  
  // Determine risk factors
  const riskFactors: string[] = [];
  if (input.previousTreatments > 2) riskFactors.push('Multiple previous treatments');
  if (input.molecularMarkers.includes('Pfkelch13 R561H')) riskFactors.push('Validated artemisinin resistance marker');
  if (input.molecularMarkers.includes('Pfcrt K76T')) riskFactors.push('Chloroquine resistance marker present');
  if (countryData?.resistanceLevel === 'high' || countryData?.resistanceLevel === 'critical') {
    riskFactors.push('High resistance environment');
  }
  if (input.patientAge < 5) riskFactors.push('Pediatric patient (higher vulnerability)');
  
  // Determine alternatives
  const alternatives: string[] = [];
  if (input.drugName.includes('Artemether-Lumefantrine')) {
    alternatives.push('Artesunate-Amodiaquine', 'Dihydroartemisinin-Piperaquine');
  } else if (input.drugName.includes('Artesunate-Amodiaquine')) {
    alternatives.push('Artemether-Lumefantrine', 'Artesunate-Pyronaridine');
  } else {
    alternatives.push('Artemether-Lumefantrine', 'Artesunate-Amodiaquine');
  }
  
  return {
    resistanceProbability: Math.round(resistanceProbability * 10) / 10,
    confidenceLevel: 85 + Math.random() * 10,
    recommendedAlternatives: alternatives,
    riskFactors: riskFactors.length > 0 ? riskFactors : ['Standard monitoring recommended'],
    timeline,
    geoRisk,
  };
};

export const molecularMarkersList = [
  { name: 'Pfkelch13 R561H', description: 'Validated artemisinin resistance marker', category: 'Artemisinin' },
  { name: 'Pfkelch13 C469Y', description: 'Validated artemisinin resistance marker', category: 'Artemisinin' },
  { name: 'Pfkelch13 A675V', description: 'Validated artemisinin resistance marker', category: 'Artemisinin' },
  { name: 'Pfkelch13 P441L', description: 'Candidate resistance marker', category: 'Artemisinin' },
  { name: 'Pfkelch13 C469F', description: 'Candidate resistance marker', category: 'Artemisinin' },
  { name: 'Pfkelch13 R622I', description: 'Validated artemisinin resistance marker', category: 'Artemisinin' },
  { name: 'Pfcrt K76T', description: 'Chloroquine resistance marker', category: 'Partner Drug' },
  { name: 'Pfmdr1 N86Y', description: 'Lumefantrine resistance marker', category: 'Partner Drug' },
  { name: 'Pfmdr1 D1246Y', description: 'Lumefantrine resistance marker', category: 'Partner Drug' },
  { name: 'Pfmdr1 Y184F', description: 'Amodiaquine resistance marker', category: 'Partner Drug' },
  { name: 'Pfdhfr S108N', description: 'Pyrimethamine resistance marker', category: 'SP' },
  { name: 'Pfdhfr C59R', description: 'Pyrimethamine resistance marker', category: 'SP' },
  { name: 'Pfdhps A437G', description: 'Sulfadoxine resistance marker', category: 'SP' },
  { name: 'Pfdhps K540E', description: 'Sulfadoxine resistance marker', category: 'SP' },
  { name: 'Pfplasmepsin2-3 CNV', description: 'Piperaquine resistance marker', category: 'Partner Drug' },
];
