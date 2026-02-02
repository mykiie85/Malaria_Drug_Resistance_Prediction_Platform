/**
 * API Service Layer for Malaria Drug Resistance Intelligence Platform
 * 
 * This module handles all communication with the FastAPI backend.
 * Endpoints are based on the backend API structure.
 */

import type { 
  CountryData, 
  PredictionResult, 
  ApiPredictionRequest, 
  ApiPredictionResponse,
  DashboardStats,
  DrugData,
  RegionInfo
} from '@/types';

// API Base URL - configurable via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0,
      null
    );
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================================
// Health Check
// ============================================================================

export interface HealthResponse {
  status: string;
  message: string;
  version: string;
  timestamp?: string;
}

export async function checkHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/api/v1/health');
}

// ============================================================================
// Drug Resistance Reports API
// ============================================================================

export interface ReportsQueryParams {
  country?: string;
  region?: string;
  drug?: string;
  year_from?: number;
  year_to?: number;
  resistance_level?: 'low' | 'medium' | 'high' | 'critical';
  limit?: number;
  offset?: number;
}

export interface ReportsResponse {
  reports: CountryData[];
  total: number;
  page: number;
  limit: number;
  last_updated: string;
}

export async function getReports(params: ReportsQueryParams = {}): Promise<ReportsResponse> {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();
  
  const endpoint = `/api/v1/reports${queryString ? `?${queryString}` : ''}`;
  return apiRequest<ReportsResponse>(endpoint);
}

export async function getReportByCountry(countryId: string): Promise<CountryData> {
  return apiRequest<CountryData>(`/api/v1/reports/country/${countryId}`);
}

export async function getReportsByRegion(region: string): Promise<CountryData[]> {
  return apiRequest<CountryData[]>(`/api/v1/reports/region/${region}`);
}

// ============================================================================
// Dashboard Statistics API
// ============================================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/api/v1/dashboard/stats');
}

export async function getRegionData(): Promise<RegionInfo[]> {
  return apiRequest<RegionInfo[]>('/api/v1/dashboard/regions');
}

export async function getTrendData(): Promise<{ year: number; resistance: number; efficacy: number }[]> {
  return apiRequest<{ year: number; resistance: number; efficacy: number }[]>('/api/v1/dashboard/trends');
}

// ============================================================================
// Drug Database API
// ============================================================================

export async function getDrugs(): Promise<DrugData[]> {
  return apiRequest<DrugData[]>('/api/v1/drugs');
}

export async function getDrugByName(drugName: string): Promise<DrugData> {
  return apiRequest<DrugData>(`/api/v1/drugs/${encodeURIComponent(drugName)}`);
}

export async function getACTDrugs(): Promise<DrugData[]> {
  return apiRequest<DrugData[]>('/api/v1/drugs?type=ACT');
}

// ============================================================================
// Molecular Markers API
// ============================================================================

export interface MolecularMarkerInfo {
  name: string;
  description: string;
  category: 'Artemisinin' | 'Partner Drug' | 'SP';
  associated_drugs: string[];
  clinical_significance: string;
}

export async function getMolecularMarkers(): Promise<MolecularMarkerInfo[]> {
  return apiRequest<MolecularMarkerInfo[]>('/api/v1/markers');
}

export async function getMarkersByCategory(category: string): Promise<MolecularMarkerInfo[]> {
  return apiRequest<MolecularMarkerInfo[]>(`/api/v1/markers?category=${encodeURIComponent(category)}`);
}

// ============================================================================
// ML Predictions API
// ============================================================================

export interface IndividualPredictionRequest {
  drug_name: string;
  country: string;
  region: string;
  patient_age: number;
  previous_treatments: number;
  molecular_markers: string[];
  parasite_density?: number;
  treatment_delay_days?: number;
}

export interface IndividualPredictionResponse {
  prediction_id: string;
  resistance_probability: number;
  confidence_interval: [number, number];
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  risk_factors: string[];
  recommended_alternatives: string[];
  model_version: string;
  model_type: string;
  created_at: string;
  disclaimer: string;
}

export async function predictIndividual(
  request: IndividualPredictionRequest
): Promise<IndividualPredictionResponse> {
  return apiRequest<IndividualPredictionResponse>('/api/v1/predictions/individual', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export interface PopulationPredictionRequest {
  country: string;
  region: string;
  drug_name: string;
  forecast_years: number;
  include_confidence_intervals?: boolean;
}

export interface PopulationPredictionResponse {
  prediction_id: string;
  country: string;
  region: string;
  drug_name: string;
  baseline_resistance: number;
  forecasts: {
    year: number;
    predicted_resistance: number;
    lower_bound: number;
    upper_bound: number;
  }[];
  trend_direction: 'increasing' | 'stable' | 'decreasing';
  model_version: string;
  created_at: string;
  disclaimer: string;
}

export async function predictPopulation(
  request: PopulationPredictionRequest
): Promise<PopulationPredictionResponse> {
  return apiRequest<PopulationPredictionResponse>('/api/v1/predictions/population', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// ============================================================================
// GIS / Geospatial API
// ============================================================================

export interface GeoJsonFeature {
  type: 'Feature';
  properties: {
    country_id: string;
    country_name: string;
    resistance_level: string;
    efficacy_rate: number;
    cases_2023: number;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface GeoJsonResponse {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

export async function getGeoJsonData(region?: string): Promise<GeoJsonResponse> {
  const endpoint = region 
    ? `/api/v1/gis/geojson?region=${encodeURIComponent(region)}`
    : '/api/v1/gis/geojson';
  return apiRequest<GeoJsonResponse>(endpoint);
}

export async function getHeatmapData(
  marker?: string
): Promise<{ lat: number; lng: number; intensity: number }[]> {
  const endpoint = marker
    ? `/api/v1/gis/heatmap?marker=${encodeURIComponent(marker)}`
    : '/api/v1/gis/heatmap';
  return apiRequest<{ lat: number; lng: number; intensity: number }[]>(endpoint);
}

// ============================================================================
// Utility: Convert API Response to Frontend Types
// ============================================================================

/**
 * Transform API prediction response to frontend PredictionResult format
 */
export function transformPredictionResponse(
  apiResponse: IndividualPredictionResponse,
  geoRisk: { region: string; risk: number }[]
): PredictionResult {
  // Generate timeline data (12 months forecast)
  const timeline = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    probability: Math.min(
      apiResponse.resistance_probability + i * 1.2,
      95
    ),
  }));

  return {
    resistanceProbability: apiResponse.resistance_probability,
    confidenceLevel: 
      100 - (apiResponse.confidence_interval[1] - apiResponse.confidence_interval[0]) / 2,
    recommendedAlternatives: apiResponse.recommended_alternatives,
    riskFactors: apiResponse.risk_factors,
    timeline,
    geoRisk,
  };
}

// ============================================================================
// Export default API object for convenience
// ============================================================================

const api = {
  // Health
  checkHealth,
  
  // Reports
  getReports,
  getReportByCountry,
  getReportsByRegion,
  
  // Dashboard
  getDashboardStats,
  getRegionData,
  getTrendData,
  
  // Drugs
  getDrugs,
  getDrugByName,
  getACTDrugs,
  
  // Markers
  getMolecularMarkers,
  getMarkersByCategory,
  
  // Predictions
  predictIndividual,
  predictPopulation,
  
  // GIS
  getGeoJsonData,
  getHeatmapData,
};

export default api;
