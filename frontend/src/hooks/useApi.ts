/**
 * Custom React Hooks for API Data Fetching
 * With robust fallback to local data
 */

import { useState, useEffect, useCallback } from 'react';
import type { CountryData, DashboardStats, DrugData, RegionInfo, PredictionResult } from '@/types';

// Import fallback data
import { 
  africanCountries, 
  drugDatabase, 
  regionData, 
  dashboardStats,
  generatePrediction,
  molecularMarkersList 
} from '@/malariaData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ============================================================================
// Simple API helper
// ============================================================================

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function postApi<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// ============================================================================
// Types
// ============================================================================

interface AppData {
  countries: CountryData[];
  drugs: DrugData[];
  regions: RegionInfo[];
  stats: DashboardStats;
  markers: typeof molecularMarkersList;
}

interface UseAppDataResult {
  data: AppData;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  refetch: () => void;
}

// ============================================================================
// Main App Data Hook - ALWAYS returns data (fallback if API fails)
// ============================================================================

export function useAppData(): UseAppDataResult {
  // Initialize with fallback data immediately
  const [data, setData] = useState<AppData>({
    countries: africanCountries,
    drugs: drugDatabase,
    regions: regionData,
    stats: dashboardStats,
    markers: molecularMarkersList,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    
    try {
      // Try to check API health
      const health = await fetchApi<{ status: string }>('/api/v1/health');
      
      if (health.status === 'healthy') {
        setIsOnline(true);
        
        // Try to fetch fresh data
        const [reportsRes, drugs, regions, stats, markers] = await Promise.all([
          fetchApi<{ reports: CountryData[] }>('/api/v1/reports?limit=50'),
          fetchApi<DrugData[]>('/api/v1/drugs'),
          fetchApi<RegionInfo[]>('/api/v1/dashboard/regions'),
          fetchApi<DashboardStats>('/api/v1/dashboard/stats'),
          fetchApi<typeof molecularMarkersList>('/api/v1/markers'),
        ]);

        setData({
          countries: reportsRes.reports,
          drugs,
          regions,
          stats,
          markers,
        });
        setError(null);
      }
    } catch (err) {
      console.warn('API unavailable, using local data:', err);
      setIsOnline(false);
      setError('Using offline data');
      // Keep the fallback data that was set initially
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, isOnline, refetch: fetchAll };
}

// ============================================================================
// Individual Prediction Hook
// ============================================================================

interface IndividualPredictionRequest {
  drug_name: string;
  country: string;
  region: string;
  patient_age: number;
  previous_treatments: number;
  molecular_markers: string[];
}

interface ApiPredictionResponse {
  prediction_id: string;
  resistance_probability: number;
  confidence_interval: [number, number];
  risk_level: string;
  risk_factors: string[];
  recommended_alternatives: string[];
  model_version: string;
  created_at: string;
  disclaimer: string;
}

interface UsePredictionResult {
  predict: (request: IndividualPredictionRequest) => Promise<void>;
  prediction: PredictionResult | null;
  rawResponse: ApiPredictionResponse | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useIndividualPrediction(): UsePredictionResult {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [rawResponse, setRawResponse] = useState<ApiPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async (request: IndividualPredictionRequest) => {
    setLoading(true);
    setError(null);

    try {
      // Try API first
      const response = await postApi<ApiPredictionResponse>('/api/v1/predictions/individual', request);
      setRawResponse(response);

      // Transform to frontend format
      const timeline = Array.from({ length: 12 }, (_, i) => ({
        month: `Month ${i + 1}`,
        probability: Math.min(response.resistance_probability + i * 1.2, 95),
      }));

      const geoRisk = regionData.map(r => ({
        region: r.name,
        risk: r.stats.avgResistance * (1 + Math.random() * 0.3),
      })).sort((a, b) => b.risk - a.risk);

      setPrediction({
        resistanceProbability: response.resistance_probability,
        confidenceLevel: 100 - (response.confidence_interval[1] - response.confidence_interval[0]) / 2,
        recommendedAlternatives: response.recommended_alternatives,
        riskFactors: response.risk_factors,
        timeline,
        geoRisk,
      });
    } catch (err) {
      console.warn('API prediction failed, using local:', err);
      
      // Use local prediction
      const localResult = generatePrediction({
        drugName: request.drug_name,
        country: request.country,
        region: request.region,
        previousTreatments: request.previous_treatments,
        patientAge: request.patient_age,
        molecularMarkers: request.molecular_markers,
      });
      setPrediction(localResult);
      setError('Using offline prediction');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPrediction(null);
    setRawResponse(null);
    setError(null);
  }, []);

  return { predict, prediction, rawResponse, loading, error, reset };
}

// Export default
export default { useAppData, useIndividualPrediction };
