import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, AlertTriangle, BarChart3, Building, ChevronRight,
  Download, Filter, Globe, MapPin, Microscope, Shield, TrendingDown,
  TrendingUp, Users, X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, AreaChart, Area
} from 'recharts';
import { africanCountries } from '@/malariaData';
import type { CountryData } from '@/types';
import 'leaflet/dist/leaflet.css';

interface ReportLayerProps {
  isActive: boolean;
  onNavigate: (layer: 'report' | 'prediction') => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const resistanceColors: Record<string, string> = {
  critical: 'bg-red-600',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

const getResistanceColor = (level: string) => {
  switch (level) {
    case 'critical': return '#dc2626';
    case 'high': return '#f97316';
    case 'medium': return '#eab308';
    case 'low': return '#22c55e';
    default: return '#6b7280';
  }
};

const getTrendIcon = (trend: string) => {
  if (trend === 'increasing') return <TrendingUp className="w-3 h-3 text-red-500" />;
  if (trend === 'decreasing') return <TrendingDown className="w-3 h-3 text-green-500" />;
  return <Activity className="w-3 h-3 text-yellow-500" />;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// Region data for the GeoJSON overlay
const regions = [
  { id: 'east', name: 'East Africa', color: '#3b82f6' },
  { id: 'west', name: 'West Africa', color: '#f59e0b' },
  { id: 'central', name: 'Central Africa', color: '#8b5cf6' },
  { id: 'southern', name: 'Southern Africa', color: '#10b981' },
];

// Static trend data for charts
const trendData = [
  { year: '2019', resistance: 18, efficacy: 95 },
  { year: '2020', resistance: 22, efficacy: 93 },
  { year: '2021', resistance: 28, efficacy: 91 },
  { year: '2022', resistance: 34, efficacy: 89 },
  { year: '2023', resistance: 38, efficacy: 87 },
];

const regionData = [
  { region: 'East Africa', cases: 39200000 },
  { region: 'West Africa', cases: 72000000 },
  { region: 'Central Africa', cases: 35000000 },
  { region: 'Southern Africa', cases: 15000000 },
];

const markerDistribution = [
  { marker: 'Pfkelch13', prevalence: 35.2 },
  { marker: 'Pfcrt', prevalence: 28.5 },
  { marker: 'Pfmdr1', prevalence: 22.3 },
  { marker: 'Pfdhfr', prevalence: 14.0 },
];

// Africa GeoJSON (simplified bounding polygons for regions)
const africaGeoJSON = {
  type: 'FeatureCollection' as const,
  features: [
    { type: 'Feature' as const, properties: { region: 'east' }, geometry: { type: 'Polygon' as const, coordinates: [[[29, -12], [42, -12], [42, 12], [29, 12], [29, -12]]] } },
    { type: 'Feature' as const, properties: { region: 'west' }, geometry: { type: 'Polygon' as const, coordinates: [[[-18, 4], [16, 4], [16, 18], [-18, 18], [-18, 4]]] } },
    { type: 'Feature' as const, properties: { region: 'central' }, geometry: { type: 'Polygon' as const, coordinates: [[[8, -6], [30, -6], [30, 8], [8, 8], [8, -6]]] } },
    { type: 'Feature' as const, properties: { region: 'southern' }, geometry: { type: 'Polygon' as const, coordinates: [[[12, -35], [36, -35], [36, -5], [12, -5], [12, -35]]] } },
  ],
};

const regionColorMap: Record<string, string> = {
  east: '#3b82f6',
  west: '#f59e0b',
  central: '#8b5cf6',
  southern: '#10b981',
};


// ═══════════════════════════════════════════════════════════════
// COUNTRY FULL REPORT MODAL — Fixed overlay that covers the viewport
// ═══════════════════════════════════════════════════════════════
function CountryFullReport({
  country,
  onClose,
  onNavigate,
}: {
  country: CountryData;
  onClose: () => void;
  onNavigate: (layer: 'report' | 'prediction') => void;
}) {
  // Generate fake efficacy trend for the country
  const countryTrend = useMemo(() => {
    const base = country.efficacyRate;
    return [
      { year: '2019', efficacy: Math.min(100, base + 6), resistance: Math.max(0, 100 - base - 6) },
      { year: '2020', efficacy: Math.min(100, base + 4), resistance: Math.max(0, 100 - base - 4) },
      { year: '2021', efficacy: Math.min(100, base + 2), resistance: Math.max(0, 100 - base - 2) },
      { year: '2022', efficacy: Math.min(100, base + 1), resistance: Math.max(0, 100 - base - 1) },
      { year: '2023', efficacy: base, resistance: 100 - base },
    ];
  }, [country]);

  return (
    // CRITICAL FIX: fixed inset-0 with z-[100] to overlay EVERYTHING including the sticky header
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute inset-4 sm:inset-6 md:inset-8 lg:inset-12 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Report Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${resistanceColors[country.resistanceLevel]}`} />
            <h2 className="text-xl font-bold text-slate-800">
              {country.name} — Full Report
            </h2>
            <Badge variant="outline" className="capitalize">
              {country.resistanceLevel} risk
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Close report"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Scrollable report body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {/* Top row: Map + Markers sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-[350px] md:h-[400px]">
                      <MapContainer
                        center={country.coordinates as [number, number]}
                        zoom={5}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        {/* Highlight the selected country */}
                        <CircleMarker
                          center={country.coordinates as [number, number]}
                          radius={18}
                          fillColor={getResistanceColor(country.resistanceLevel)}
                          color="#fff"
                          weight={3}
                          opacity={1}
                          fillOpacity={0.8}
                        >
                          <Popup>
                            <strong>{country.name}</strong><br />
                            Resistance: {country.resistanceLevel.toUpperCase()}<br />
                            Efficacy: {country.efficacyRate}%
                          </Popup>
                        </CircleMarker>
                        {/* Show other countries faded */}
                        {africanCountries
                          .filter(c => c.id !== country.id)
                          .map(c => (
                            <CircleMarker
                              key={c.id}
                              center={c.coordinates as [number, number]}
                              radius={6}
                              fillColor={getResistanceColor(c.resistanceLevel)}
                              color="#fff"
                              weight={1}
                              opacity={0.4}
                              fillOpacity={0.3}
                            />
                          ))}
                      </MapContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Molecular Markers sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Microscope className="w-4 h-4 text-purple-500" />
                      Molecular Markers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {country.molecularMarkers.map((marker, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate mr-2">{marker.name}</span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {getTrendIcon(marker.trend)}
                            <span className="text-sm font-bold">{marker.prevalence}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="outline" className="text-xs">
                            {marker.significance}
                          </Badge>
                          <span className="text-xs text-slate-500 capitalize">{marker.trend}</span>
                        </div>
                        <Progress
                          value={marker.prevalence}
                          className="mt-2 h-1.5"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Cases (2023)</span>
                      <span className="font-bold">{formatNumber(country.cases2023)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Deaths (2023)</span>
                      <span className="font-bold">{formatNumber(country.deaths2023)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Efficacy Rate</span>
                      <span className={`font-bold ${country.efficacyRate >= 90 ? 'text-green-600' : country.efficacyRate >= 85 ? 'text-amber-600' : 'text-red-600'}`}>
                        {country.efficacyRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Last Survey</span>
                      <span className="font-bold">{country.lastSurvey}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* National Treatment Policy */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  National Treatment Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed bg-white rounded-lg p-4 border border-blue-100">
                  {country.treatmentPolicy}
                </p>
                <p className="text-xs text-slate-500 mt-3 italic">
                  Source: WHO Essential Medicines List &amp; National Malaria Control Programme guidelines.
                  Treatment policy should be reviewed when ACT efficacy falls below 90%.
                </p>
              </CardContent>
            </Card>

            {/* Analytics & Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Analytics &amp; Trends
                </CardTitle>
                <CardDescription>
                  Historical efficacy and resistance data for {country.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="efficacy" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="efficacy">Efficacy Trend</TabsTrigger>
                    <TabsTrigger value="markers">Marker Analysis</TabsTrigger>
                    <TabsTrigger value="summary">Summary Table</TabsTrigger>
                  </TabsList>

                  <TabsContent value="efficacy">
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={countryTrend}>
                        <defs>
                          <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="year" />
                        <YAxis domain={[0, 100]} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Area type="monotone" dataKey="efficacy" name="Efficacy (%)" stroke="#22c55e" fillOpacity={1} fill="url(#colorEff)" strokeWidth={2} />
                        <Area type="monotone" dataKey="resistance" name="Resistance (%)" stroke="#ef4444" fillOpacity={1} fill="url(#colorRes)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </TabsContent>

                  <TabsContent value="markers">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ResponsiveContainer width="100%" height={250}>
                        <RechartsPie>
                          <Pie
                            data={country.molecularMarkers.map(m => ({ name: m.name, value: m.prevalence }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {country.molecularMarkers.map((_, idx) => (
                              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </RechartsPie>
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {country.molecularMarkers.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                            <span className="flex-1 truncate">{m.name}</span>
                            <span className="font-bold">{m.prevalence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Marker</th>
                            <th className="text-center py-3 px-4 font-semibold text-slate-700">Prevalence</th>
                            <th className="text-center py-3 px-4 font-semibold text-slate-700">Trend</th>
                            <th className="text-center py-3 px-4 font-semibold text-slate-700">Significance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {country.molecularMarkers.map((m, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="py-3 px-4 font-medium">{m.name}</td>
                              <td className="py-3 px-4 text-center font-bold">{m.prevalence}%</td>
                              <td className="py-3 px-4 text-center capitalize flex items-center justify-center gap-1">
                                {getTrendIcon(m.trend)} {m.trend}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Badge variant="outline" className="text-xs capitalize">{m.significance}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" onClick={() => { onClose(); onNavigate('prediction'); }}>
                <Activity className="w-4 h-4 mr-2" />
                Run Prediction for {country.name}
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Export Report (PDF)
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-slate-500 text-center border-t border-slate-200 pt-4">
              <p>
                For surveillance and research purposes only. Not for clinical decision-making.
                <br />
                Developed by <strong>Mike Sanga</strong> — mykiie85@gmail.com
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// MAIN REPORT LAYER
// ═══════════════════════════════════════════════════════════════
export default function ReportLayer({ isActive, onNavigate }: ReportLayerProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [colorBy, setColorBy] = useState<string>('resistance');
  const [showFullReport, setShowFullReport] = useState(false);

  const filteredCountries = useMemo(() => {
    if (selectedRegion === 'all') return africanCountries;
    return africanCountries.filter(c => c.region === selectedRegion);
  }, [selectedRegion]);

  const getColor = (country: CountryData) => {
    if (colorBy === 'resistance') return getResistanceColor(country.resistanceLevel);
    if (colorBy === 'efficacy') {
      return country.efficacyRate >= 95 ? '#22c55e' : country.efficacyRate >= 90 ? '#eab308' : country.efficacyRate >= 85 ? '#f97316' : '#dc2626';
    }
    const ratio = Math.log(country.cases2023) / Math.log(70000000);
    return ratio > 0.8 ? '#dc2626' : ratio > 0.6 ? '#f97316' : ratio > 0.4 ? '#eab308' : '#22c55e';
  };

  const getSize = (country: CountryData) => {
    if (colorBy === 'cases') return Math.max(8, Math.log(country.cases2023 / 100000) * 3);
    return 10;
  };

  const summaryStats = useMemo(() => {
    const countries = filteredCountries;
    const totalCases = countries.reduce((sum, c) => sum + c.cases2023, 0);
    const totalDeaths = countries.reduce((sum, c) => sum + c.deaths2023, 0);
    const avgEfficacy = countries.reduce((sum, c) => sum + c.efficacyRate, 0) / countries.length;
    const highRiskCount = countries.filter(c => c.resistanceLevel === 'high' || c.resistanceLevel === 'critical').length;
    return { totalCases, totalDeaths, avgEfficacy, highRiskCount, totalCountries: countries.length };
  }, [filteredCountries]);

  const geoStyle = (feature: any) => ({
    fillColor: regionColorMap[feature.properties.region],
    weight: 2,
    opacity: 0.3,
    color: regionColorMap[feature.properties.region],
    dashArray: '3',
    fillOpacity: 0.1,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Cases (2023)</p>
                <p className="text-2xl font-bold">{(summaryStats.totalCases / 1e6).toFixed(1)}M</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg shadow-red-500/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Deaths (2023)</p>
                <p className="text-2xl font-bold">{(summaryStats.totalDeaths / 1e3).toFixed(1)}K</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg shadow-green-500/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Avg Efficacy</p>
                <p className="text-2xl font-bold">{summaryStats.avgEfficacy.toFixed(1)}%</p>
              </div>
              <Activity className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg shadow-amber-500/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">High Resistance</p>
                <p className="text-2xl font-bold">{summaryStats.highRiskCount}</p>
              </div>
              <Shield className="w-8 h-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Map + Country Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Geospatial Surveillance Map
                  </CardTitle>
                  <CardDescription>Interactive visualization of resistance patterns across Africa</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={colorBy} onValueChange={v => setColorBy(v)}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resistance">Resistance Level</SelectItem>
                      <SelectItem value="efficacy">Drug Efficacy</SelectItem>
                      <SelectItem value="cases">Case Burden</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] relative">
                <MapContainer
                  center={[0, 20]}
                  zoom={3}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  <GeoJSON data={africaGeoJSON as any} style={geoStyle} />
                  {filteredCountries.map(country => (
                    <CircleMarker
                      key={country.id}
                      center={country.coordinates as [number, number]}
                      radius={getSize(country)}
                      fillColor={getColor(country)}
                      color="#fff"
                      weight={2}
                      opacity={1}
                      fillOpacity={0.8}
                      eventHandlers={{ click: () => setSelectedCountry(country) }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[250px]">
                          <h3 className="font-bold text-lg mb-2">{country.name}</h3>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-slate-500">Region:</span> {country.region}</p>
                            <p>
                              <span className="text-slate-500">Resistance:</span>{' '}
                              <span className={`ml-1 px-2 py-0.5 rounded text-xs text-white ${resistanceColors[country.resistanceLevel]}`}>
                                {country.resistanceLevel.toUpperCase()}
                              </span>
                            </p>
                            <p><span className="text-slate-500">Efficacy:</span> {country.efficacyRate}%</p>
                            <p><span className="text-slate-500">Cases 2023:</span> {(country.cases2023 / 1e6).toFixed(1)}M</p>
                            <p><span className="text-slate-500">Deaths 2023:</span> {country.deaths2023.toLocaleString()}</p>
                            <p className="text-xs text-slate-400 mt-2">Last survey: {country.lastSurvey}</p>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>

                {/* Legend overlay */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200">
                  <p className="text-sm font-semibold mb-2">Legend</p>
                  {colorBy === 'resistance' && (
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Low (&lt;30%)</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500" /> Medium (30-50%)</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500" /> High (50-70%)</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600" /> Critical (&gt;70%)</div>
                    </div>
                  )}
                  {colorBy === 'efficacy' && (
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> ≥95%</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500" /> 90-95%</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500" /> 85-90%</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600" /> &lt;85%</div>
                    </div>
                  )}
                  {colorBy === 'cases' && (
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Low</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500" /> Medium</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500" /> High</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600" /> Critical</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Resistance &amp; Efficacy Trends (2019-2023)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorResistance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEfficacy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Area type="monotone" dataKey="resistance" name="Resistance (%)" stroke="#ef4444" fillOpacity={1} fill="url(#colorResistance)" strokeWidth={2} />
                  <Area type="monotone" dataKey="efficacy" name="Efficacy (%)" stroke="#22c55e" fillOpacity={1} fill="url(#colorEfficacy)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Region Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant={selectedRegion === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedRegion('all')}>
                  All Regions
                </Button>
                {regions.map(r => (
                  <Button
                    key={r.id}
                    variant={selectedRegion === r.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRegion(r.id)}
                    style={{ borderColor: selectedRegion === r.id ? undefined : r.color }}
                  >
                    {r.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regional Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Regional Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={regionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="region" type="category" width={80} tick={{ fontSize: 11 }} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(v: number) => [(v / 1e6).toFixed(1) + 'M cases', 'Cases']}
                  />
                  <Bar dataKey="cases" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Molecular Markers Pie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Microscope className="w-4 h-4 text-purple-500" />
                Molecular Markers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={markerDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="prevalence"
                    nameKey="marker"
                  >
                    {markerDistribution.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {markerDistribution.map((m, idx) => (
                  <div key={m.marker} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="truncate max-w-[120px]">{m.marker}</span>
                    </div>
                    <span className="font-medium">{m.prevalence.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Country Details Panel */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-500" />
                {selectedCountry ? selectedCountry.name : 'Country Details'}
              </CardTitle>
              <CardDescription>
                {selectedCountry ? 'Detailed resistance profile' : 'Click a marker on the map'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCountry ? (
                <ScrollArea className="h-[380px]">
                  <div className="space-y-4 pr-4">
                    {/* Resistance badge */}
                    <div className="flex items-center gap-2">
                      <Badge className={`${resistanceColors[selectedCountry.resistanceLevel]} text-white capitalize`}>
                        {selectedCountry.resistanceLevel}
                      </Badge>
                      <span className="text-sm text-slate-600">Efficacy: {selectedCountry.efficacyRate}%</span>
                    </div>

                    {/* Key stats */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">Cases</p>
                        <p className="text-sm font-bold">{formatNumber(selectedCountry.cases2023)}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">Deaths</p>
                        <p className="text-sm font-bold">{formatNumber(selectedCountry.deaths2023)}</p>
                      </div>
                    </div>

                    {/* Markers */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Molecular Markers</h4>
                      <div className="space-y-2">
                        {selectedCountry.molecularMarkers.map((marker, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-lg p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{marker.name}</span>
                              <div className="flex items-center gap-2">
                                {getTrendIcon(marker.trend)}
                                <span className="text-sm font-bold">{marker.prevalence}%</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{marker.significance}</Badge>
                              <span className="text-xs text-slate-500">{marker.trend}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Treatment Policy */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Treatment Policy</h4>
                      <p className="text-sm text-slate-600 bg-blue-50 rounded-lg p-3">
                        {selectedCountry.treatmentPolicy}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => onNavigate('prediction')}>
                        Run Prediction
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setShowFullReport(true)}
                      >
                        Full Report
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-[380px] flex flex-col items-center justify-center text-slate-400">
                  <MapPin className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">Click on a country marker</p>
                  <p className="text-xs">to view detailed information</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-slate-800 mb-2">Ready to predict?</h4>
              <p className="text-sm text-slate-600 mb-4">
                Use our ML model to predict drug resistance patterns based on molecular markers and treatment history.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => onNavigate('prediction')}>
                <Activity className="w-4 h-4 mr-2" />
                Open Prediction Layer
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Country Data Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Country-Level Surveillance Data
            </CardTitle>
            <CardDescription>Detailed information on resistance levels, treatment policies, and molecular markers</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Countries</TabsTrigger>
                <TabsTrigger value="high">High Resistance</TabsTrigger>
                <TabsTrigger value="markers">Molecular Markers</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Country</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Region</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-700">Resistance</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-700">Efficacy</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Cases 2023</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Treatment Policy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCountries.map(country => (
                        <tr key={country.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{country.name}</td>
                          <td className="py-3 px-4 capitalize">{country.region}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={`${resistanceColors[country.resistanceLevel]} text-white capitalize`}>
                              {country.resistanceLevel}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-medium ${country.efficacyRate >= 95 ? 'text-green-600' : country.efficacyRate >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                              {country.efficacyRate}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">{(country.cases2023 / 1e6).toFixed(1)}M</td>
                          <td className="py-3 px-4 text-xs max-w-xs truncate">{country.treatmentPolicy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="high">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCountries
                    .filter(c => c.resistanceLevel === 'high' || c.resistanceLevel === 'critical')
                    .map(country => (
                      <Card key={country.id} className="border-red-200 bg-red-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-slate-800">{country.name}</h4>
                            <Badge className={`${resistanceColors[country.resistanceLevel]} text-white capitalize`}>
                              {country.resistanceLevel}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">Efficacy: {country.efficacyRate}%</p>
                          <p className="text-sm text-slate-600">Cases: {formatNumber(country.cases2023)}</p>
                          <div className="mt-2">
                            <p className="text-xs text-slate-500 mb-1">Key markers:</p>
                            <div className="flex flex-wrap gap-1">
                              {country.molecularMarkers.slice(0, 3).map((m, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {m.name.split(' ')[1] || m.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="markers">
                <div className="space-y-4">
                  {filteredCountries.map(country => (
                    <div key={country.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="w-32 flex-shrink-0">
                        <p className="font-semibold text-slate-800">{country.name}</p>
                        <p className="text-xs text-slate-500">{country.molecularMarkers.length} markers</p>
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {country.molecularMarkers.map(m => (
                          <Badge key={m.name} variant="outline" className="text-xs">
                            {m.name} ({m.prevalence}%)
                            {m.trend === 'increasing' && <TrendingUp className="w-3 h-3 ml-1 inline" />}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══ Full Report Modal Overlay ═══ */}
      <AnimatePresence>
        {showFullReport && selectedCountry && (
          <CountryFullReport
            country={selectedCountry}
            onClose={() => setShowFullReport(false)}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
