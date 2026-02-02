export interface MolecularMarker {
  name: string;
  prevalence: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  significance: 'validated' | 'candidate';
}

export interface CountryData {
  id: string;
  name: string;
  region: 'east' | 'west' | 'central' | 'south';
  coordinates: [number, number];
  resistanceLevel: 'low' | 'medium' | 'high' | 'critical';
  efficacyRate: number;
  molecularMarkers: MolecularMarker[];
  cases2023: number;
  deaths2023: number;
  treatmentPolicy: string;
  lastSurvey: string;
}

export interface DrugData {
  name: string;
  type: 'ACT' | 'Non-ACT' | 'Monotherapy';
  firstLine: boolean;
  efficacy2023: number;
  efficacy2022: number;
  efficacy2021: number;
  resistanceMarkers: string[];
}

export interface RegionStats {
  totalCases: number;
  avgResistance: number;
  surveillanceSites: number;
}

export interface RegionInfo {
  id: string;
  name: string;
  countries: string[];
  color: string;
  stats: RegionStats;
}

export interface TrendDataPoint {
  year: number;
  resistance: number;
  efficacy: number;
}

export interface RegionDataPoint {
  region: string;
  cases: number;
  resistance: number;
}

export interface MarkerDistributionPoint {
  marker: string;
  prevalence: number;
}

export interface DashboardStats {
  totalCountries: number;
  highResistanceCount: number;
  avgEfficacy: number;
  activeSurveillance: number;
  trendData: TrendDataPoint[];
  regionData: RegionDataPoint[];
  markerDistribution: MarkerDistributionPoint[];
}

export interface TimelinePoint {
  month: string;
  probability: number;
}

export interface GeoRiskPoint {
  region: string;
  risk: number;
}

export interface PredictionResult {
  resistanceProbability: number;
  confidenceLevel: number;
  recommendedAlternatives: string[];
  riskFactors: string[];
  timeline: TimelinePoint[];
  geoRisk: GeoRiskPoint[];
}

export interface PredictionInput {
  drugName: string;
  country: string;
  region: string;
  previousTreatments: number;
  patientAge: number;
  molecularMarkers: string[];
}

export interface MarkerInfo {
  name: string;
  description: string;
  category: 'Artemisinin' | 'Partner Drug' | 'SP';
}

// API Response types (for backend integration)
export interface ApiHealthResponse {
  status: string;
  message: string;
  version: string;
}

export interface ApiCountryResponse {
  countries: CountryData[];
  total: number;
  lastUpdated: string;
}

export interface ApiPredictionRequest {
  drug_name: string;
  country: string;
  region: string;
  previous_treatments: number;
  patient_age: number;
  molecular_markers: string[];
}

export interface ApiPredictionResponse {
  prediction_id: string;
  resistance_probability: number;
  confidence_interval: [number, number];
  risk_factors: string[];
  recommendations: string[];
  model_version: string;
  disclaimer: string;
}
