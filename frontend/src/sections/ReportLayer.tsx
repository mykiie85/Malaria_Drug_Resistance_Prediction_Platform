import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, TrendingUp, TrendingDown, AlertTriangle, Activity, 
  Globe, Microscope, Filter, Download, Building, RefreshCcw, Info, BarChart3,
  Wifi, WifiOff, FileText, Link2, Twitter, Linkedin, Copy, Check, X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { useAppData } from '@/hooks/useApi';
import type { CountryData } from '@/types';
import 'leaflet/dist/leaflet.css';

interface ReportLayerProps {
  isActive: boolean;
  onNavigate: (layer: 'report' | 'prediction') => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

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

export default function ReportLayer({ isActive, onNavigate }: ReportLayerProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [mapCenter] = useState<[number, number]>([0, 20]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [copied, setCopied] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Fetch data from API with fallback to local data
  const { data, loading, error, isOnline, refetch } = useAppData();
  const { countries, drugs, regions, stats } = data;

  // Filter countries by region
  const filteredCountries = useMemo(() => {
    if (selectedRegion === 'all') return countries;
    return countries.filter(c => c.region === selectedRegion);
  }, [selectedRegion, countries]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const countryList = filteredCountries;
    const totalCases = countryList.reduce((sum, c) => sum + c.cases2023, 0);
    const avgEfficacy = countryList.reduce((sum, c) => sum + c.efficacyRate, 0) / countryList.length;
    const highRiskCount = countryList.filter(c => c.resistanceLevel === 'high' || c.resistanceLevel === 'critical').length;
    return { totalCases, avgEfficacy, highRiskCount, totalCountries: countryList.length };
  }, [filteredCountries]);

  // Filter ACT drugs for chart
  const actDrugs = useMemo(() => drugs.filter(d => d.type === 'ACT'), [drugs]);

  // Handle refresh
  const handleRefresh = async () => {
    await refetch();
  };

  // Export functions
  const handleExportPDF = () => {
    // Generate report content
    const reportContent = generateReportContent();
    
    // Create a new window for printing/PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Malaria Drug Resistance Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #1e40af; }
            h2 { color: #374151; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; }
            .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { background: #f3f4f6; padding: 16px; border-radius: 8px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #1f2937; }
            .stat-label { font-size: 12px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background: #3b82f6; color: white; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${reportContent}
          <div class="footer">
            <p><strong>Disclaimer:</strong> This report is for surveillance and research purposes only.</p>
            <p>Generated on ${new Date().toLocaleString()} | Developed by Mike Sanga (mykiie85@gmail.com)</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    setShowExportMenu(false);
  };

  const generateReportContent = () => {
    return `
      <h1>🦟 Malaria Drug Resistance Intelligence Report</h1>
      <p>Region: ${selectedRegion === 'all' ? 'All Sub-Saharan Africa' : selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1) + ' Africa'}</p>
      
      <h2>Summary Statistics</h2>
      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">${summaryStats.totalCountries}</div>
          <div class="stat-label">Countries Monitored</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${summaryStats.highRiskCount}</div>
          <div class="stat-label">High Risk Areas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${summaryStats.avgEfficacy.toFixed(1)}%</div>
          <div class="stat-label">Average ACT Efficacy</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(summaryStats.totalCases)}</div>
          <div class="stat-label">Total Cases (2023)</div>
        </div>
      </div>
      
      <h2>Country-Level Data</h2>
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Region</th>
            <th>Risk Level</th>
            <th>ACT Efficacy</th>
            <th>Cases (2023)</th>
          </tr>
        </thead>
        <tbody>
          ${filteredCountries.map(c => `
            <tr>
              <td>${c.name}</td>
              <td>${c.region.charAt(0).toUpperCase() + c.region.slice(1)} Africa</td>
              <td style="color: ${getResistanceColor(c.resistanceLevel)}">${c.resistanceLevel.toUpperCase()}</td>
              <td>${c.efficacyRate}%</td>
              <td>${formatNumber(c.cases2023)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowExportMenu(false);
  };

  const handleShareTwitter = () => {
    const text = `Exploring malaria drug resistance data across Sub-Saharan Africa. Check out this surveillance dashboard!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    setShowExportMenu(false);
  };

  const handleShareLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    setShowExportMenu(false);
  };

  // Full report modal for selected country
  const renderFullReport = () => {
    if (!selectedCountry || !showFullReport) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setShowFullReport(false)}
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{selectedCountry.name} - Full Report</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowFullReport(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Overview */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Region</p>
                  <p className="text-lg font-semibold">{selectedCountry.region.charAt(0).toUpperCase() + selectedCountry.region.slice(1)} Africa</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Risk Level</p>
                  <p className="text-lg font-semibold" style={{ color: getResistanceColor(selectedCountry.resistanceLevel) }}>
                    {selectedCountry.resistanceLevel.toUpperCase()}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">ACT Efficacy</p>
                  <p className="text-lg font-semibold">{selectedCountry.efficacyRate}%</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Cases (2023)</p>
                  <p className="text-lg font-semibold">{formatNumber(selectedCountry.cases2023)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Deaths (2023)</p>
                  <p className="text-lg font-semibold">{formatNumber(selectedCountry.deaths2023)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Last Survey</p>
                  <p className="text-lg font-semibold">{selectedCountry.lastSurvey}</p>
                </div>
              </div>
            </div>

            {/* Treatment Policy */}
            <div>
              <h3 className="font-semibold text-lg mb-3">National Treatment Policy</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">{selectedCountry.treatmentPolicy}</p>
              </div>
            </div>

            {/* Molecular Markers */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Molecular Markers</h3>
              <div className="space-y-3">
                {selectedCountry.molecularMarkers.map((marker, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{marker.name}</span>
                      <Badge variant={marker.significance === 'validated' ? 'default' : 'secondary'}>
                        {marker.significance}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Prevalence:</span>
                        <span className="font-semibold">{marker.prevalence}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Trend:</span>
                        {getTrendIcon(marker.trend)}
                        <span>{marker.trend}</span>
                      </div>
                    </div>
                    <Progress value={marker.prevalence} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={() => { setShowFullReport(false); onNavigate('prediction'); }} className="flex-1">
                Run ML Prediction
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Surveillance Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
              Real-time drug resistance monitoring across Sub-Saharan Africa
              {isOnline ? (
                <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                  <Wifi className="w-3 h-3 mr-1" /> Live
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                  <WifiOff className="w-3 h-3 mr-1" /> Offline
                </Badge>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="east">East Africa</SelectItem>
                <SelectItem value="west">West Africa</SelectItem>
                <SelectItem value="central">Central Africa</SelectItem>
                <SelectItem value="south">Southern Africa</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={loading}
              className="min-w-[100px]"
            >
              <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            
            {/* Export Dropdown */}
            <div className="relative" ref={exportRef}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              {showExportMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50"
                >
                  <button 
                    onClick={handleExportPDF}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Export as PDF
                  </button>
                  <button 
                    onClick={handleCopyLink}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <hr className="my-2 border-slate-200 dark:border-slate-700" />
                  <button 
                    onClick={handleShareTwitter}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Twitter className="w-4 h-4" />
                    Share on Twitter
                  </button>
                  <button 
                    onClick={handleShareLinkedIn}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    Share on LinkedIn
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-amber-700 text-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600">Countries</p>
                  <p className="text-2xl font-bold text-blue-900">{summaryStats.totalCountries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-amber-600">High Risk</p>
                  <p className="text-2xl font-bold text-amber-900">{summaryStats.highRiskCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Avg Efficacy</p>
                  <p className="text-2xl font-bold text-green-900">{summaryStats.avgEfficacy.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                  <Microscope className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600">Total Cases</p>
                  <p className="text-2xl font-bold text-purple-900">{formatNumber(summaryStats.totalCases)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-[500px] overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      Resistance Map
                    </CardTitle>
                    <CardDescription>Click on markers for details</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span>Low</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span>Medium</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500"></span>High</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span>Critical</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[420px]">
                <MapContainer
                  center={mapCenter}
                  zoom={3}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredCountries.map((country) => (
                    <CircleMarker
                      key={country.id}
                      center={country.coordinates}
                      radius={Math.max(8, Math.sqrt(country.cases2023 / 1000000) * 3)}
                      fillColor={getResistanceColor(country.resistanceLevel)}
                      color="#fff"
                      weight={2}
                      opacity={1}
                      fillOpacity={0.7}
                      eventHandlers={{
                        click: () => setSelectedCountry(country),
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <h3 className="font-bold text-lg">{country.name}</h3>
                          <div className="mt-2 text-sm space-y-1">
                            <p><strong>Risk Level:</strong> {country.resistanceLevel.toUpperCase()}</p>
                            <p><strong>Efficacy:</strong> {country.efficacyRate}%</p>
                            <p><strong>Cases 2023:</strong> {formatNumber(country.cases2023)}</p>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Country Details Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-[500px]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-slate-500" />
                  {selectedCountry ? selectedCountry.name : 'Country Details'}
                </CardTitle>
                <CardDescription>
                  {selectedCountry ? 'Detailed resistance profile' : 'Select a country on the map'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCountry ? (
                  <ScrollArea className="h-[380px] pr-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge 
                          style={{ 
                            backgroundColor: getResistanceColor(selectedCountry.resistanceLevel) + '20',
                            color: getResistanceColor(selectedCountry.resistanceLevel),
                            borderColor: getResistanceColor(selectedCountry.resistanceLevel)
                          }}
                          variant="outline"
                        >
                          {selectedCountry.resistanceLevel.toUpperCase()} RESISTANCE
                        </Badge>
                        <Badge variant="secondary">{selectedCountry.region.toUpperCase()} AFRICA</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                          <p className="text-xs text-slate-500">ACT Efficacy</p>
                          <p className="text-xl font-bold text-slate-800 dark:text-white">{selectedCountry.efficacyRate}%</p>
                          <Progress value={selectedCountry.efficacyRate} className="mt-1 h-1" />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                          <p className="text-xs text-slate-500">Cases (2023)</p>
                          <p className="text-xl font-bold text-slate-800 dark:text-white">{formatNumber(selectedCountry.cases2023)}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Microscope className="w-4 h-4" />
                          Molecular Markers
                        </h4>
                        <div className="space-y-2">
                          {selectedCountry.molecularMarkers.map((marker, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{marker.name}</span>
                                <div className="flex items-center gap-2">
                                  {getTrendIcon(marker.trend)}
                                  <span className="text-sm font-bold">{marker.prevalence}%</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {marker.significance}
                                </Badge>
                                <span className="text-xs text-slate-500">{marker.trend}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Treatment Policy</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                          {selectedCountry.treatmentPolicy}
                        </p>
                      </div>

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
          </motion.div>
        </div>

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Analytics & Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="trends" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="trends">Resistance Trends</TabsTrigger>
                  <TabsTrigger value="drugs">Drug Efficacy</TabsTrigger>
                  <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="trends" className="mt-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="year" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <RechartsTooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                        <Line type="monotone" dataKey="resistance" stroke="#ef4444" strokeWidth={2} name="Resistance (%)" dot={{ fill: '#ef4444' }} />
                        <Line type="monotone" dataKey="efficacy" stroke="#22c55e" strokeWidth={2} name="Efficacy (%)" dot={{ fill: '#22c55e' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="drugs" className="mt-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={actDrugs}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={80} />
                        <YAxis stroke="#64748b" domain={[80, 100]} />
                        <RechartsTooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                        <Bar dataKey="efficacy2023" fill="#3b82f6" name="2023 Efficacy" />
                        <Bar dataKey="efficacy2022" fill="#93c5fd" name="2022 Efficacy" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="regional" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[250px]">
                      <h4 className="text-sm font-semibold mb-2">Cases by Region</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie data={stats.regionData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="cases" nameKey="region" label={({ region, percent }) => `${region.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}>
                            {stats.regionData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold mb-2">Regional Resistance Levels</h4>
                      {regions.map((region, idx) => (
                        <div key={region.id} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{region.name}</span>
                              <span className="text-sm text-slate-500">{region.stats.avgResistance.toFixed(1)}%</span>
                            </div>
                            <Progress value={region.stats.avgResistance} className="h-2 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Disclaimer:</strong> This platform is intended for surveillance and research purposes only. 
              Data presented must not be used as a substitute for clinical judgment or national treatment guidelines. 
              Always consult WHO recommendations and local NMCP protocols for treatment decisions.
              <div className="mt-3 pt-3 border-t border-amber-200">
                <span className="font-semibold">Developed by Mike Sanga</span>
                <span className="mx-2">•</span>
                <a href="mailto:mykiie85@gmail.com" className="text-amber-700 hover:text-amber-900 underline">mykiie85@gmail.com</a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full Report Modal */}
        {renderFullReport()}
      </div>
    </TooltipProvider>
  );
}
