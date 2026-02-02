import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertCircle, CheckCircle2, Activity, TrendingUp, Beaker, User, MapPin, Clock, Loader2, ArrowRight, AlertTriangle, Info, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useAppData, useIndividualPrediction } from '@/hooks/useApi';

interface PredictionLayerProps {
  isActive: boolean;
  onNavigate: (layer: 'report' | 'prediction') => void;
}

const getRiskColor = (probability: number) => {
  if (probability >= 70) return '#dc2626';
  if (probability >= 50) return '#f97316';
  if (probability >= 30) return '#eab308';
  return '#22c55e';
};

const getRiskLevel = (probability: number) => {
  if (probability >= 70) return { level: 'CRITICAL', color: 'red' };
  if (probability >= 50) return { level: 'HIGH', color: 'orange' };
  if (probability >= 30) return { level: 'MODERATE', color: 'yellow' };
  return { level: 'LOW', color: 'green' };
};

export default function PredictionLayer({ isActive, onNavigate }: PredictionLayerProps) {
  const [selectedDrug, setSelectedDrug] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [previousTreatments, setPreviousTreatments] = useState<string>('0');
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const { data, isOnline } = useAppData();
  const { countries, drugs, markers } = data;
  const { predict, prediction, rawResponse, loading: predictionLoading, error: predictionError, reset: resetPrediction } = useIndividualPrediction();

  const actDrugs = drugs.filter(d => d.type === 'ACT');
  const countryData = countries.find(c => c.name === selectedCountry);

  const handleMarkerToggle = (marker: string) => {
    setSelectedMarkers(prev => prev.includes(marker) ? prev.filter(m => m !== marker) : [...prev, marker]);
  };

  const handlePredict = useCallback(async () => {
    if (!selectedDrug || !selectedCountry || !patientAge) { setFormError('Please fill in all required fields'); return; }
    const age = parseInt(patientAge);
    if (isNaN(age) || age < 0 || age > 120) { setFormError('Please enter a valid age (0-120)'); return; }
    setFormError(null);
    await predict({
      drug_name: selectedDrug,
      country: selectedCountry,
      region: countryData?.region || 'east',
      patient_age: age,
      previous_treatments: parseInt(previousTreatments) || 0,
      molecular_markers: selectedMarkers,
    });
  }, [selectedDrug, selectedCountry, patientAge, previousTreatments, selectedMarkers, countryData, predict]);

  const resetForm = () => {
    setSelectedDrug(''); setSelectedCountry(''); setPatientAge(''); setPreviousTreatments('0'); setSelectedMarkers([]); setFormError(null); resetPrediction();
  };

  const risk = prediction ? getRiskLevel(prediction.resistanceProbability) : null;
  const error = formError || predictionError;

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Brain className="w-6 h-6 text-blue-600" />ML Prediction Engine</h2>
              <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                Predict drug resistance probability using ensemble ML models
                {isOnline ? <Badge variant="outline" className="text-green-600 border-green-300"><Wifi className="w-3 h-3 mr-1" />API Connected</Badge> : <Badge variant="outline" className="text-amber-600 border-amber-300"><WifiOff className="w-3 h-3 mr-1" />Offline Mode</Badge>}
              </p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('report')}><ArrowRight className="w-4 h-4 mr-2 rotate-180" />Back to Dashboard</Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Beaker className="w-5 h-5 text-blue-500" />Prediction Parameters</CardTitle><CardDescription>Enter clinical and epidemiological data</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label className="flex items-center gap-2"><Beaker className="w-4 h-4" />Antimalarial Drug *</Label><Select value={selectedDrug} onValueChange={setSelectedDrug}><SelectTrigger><SelectValue placeholder="Select drug combination" /></SelectTrigger><SelectContent>{actDrugs.map(drug => (<SelectItem key={drug.name} value={drug.name}><span>{drug.name}</span>{drug.firstLine && <Badge variant="secondary" className="ml-2 text-xs">1st Line</Badge>}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label className="flex items-center gap-2"><MapPin className="w-4 h-4" />Location (Country) *</Label><Select value={selectedCountry} onValueChange={setSelectedCountry}><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger><SelectContent>{countries.map(country => (<SelectItem key={country.id} value={country.name}><div className="flex items-center gap-2"><span>{country.name}</span><Badge variant="outline" className="text-xs">{country.resistanceLevel}</Badge></div></SelectItem>))}</SelectContent></Select></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="flex items-center gap-2"><User className="w-4 h-4" />Patient Age *</Label><Input type="number" placeholder="Years" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} min="0" max="120" /></div>
                  <div className="space-y-2"><Label className="flex items-center gap-2"><Clock className="w-4 h-4" />Previous Treatments</Label><Select value={previousTreatments} onValueChange={setPreviousTreatments}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[0,1,2,3,4,5].map(num => (<SelectItem key={num} value={num.toString()}>{num === 0 ? 'None' : `${num} previous`}</SelectItem>))}</SelectContent></Select></div>
                </div>
                <div className="space-y-2"><Label className="flex items-center gap-2"><Activity className="w-4 h-4" />Detected Molecular Markers</Label><ScrollArea className="h-[200px] border rounded-lg p-3"><div className="space-y-2">{markers.map(marker => (<div key={marker.name} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50"><Checkbox id={marker.name} checked={selectedMarkers.includes(marker.name)} onCheckedChange={() => handleMarkerToggle(marker.name)} /><div className="flex-1"><label htmlFor={marker.name} className="text-sm font-medium cursor-pointer">{marker.name}</label><p className="text-xs text-slate-500">{marker.description}</p></div><Badge variant="outline" className="text-xs">{marker.category}</Badge></div>))}</div></ScrollArea></div>
                <AnimatePresence>{error && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm"><AlertCircle className="w-4 h-4" />{error}</motion.div>)}</AnimatePresence>
                <div className="flex gap-3"><Button onClick={handlePredict} disabled={predictionLoading} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">{predictionLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <><Sparkles className="w-4 h-4 mr-2" />Run Prediction</>}</Button><Button variant="outline" onClick={resetForm}>Reset</Button></div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" />Prediction Results</CardTitle><CardDescription>{rawResponse ? `Prediction ID: ${rawResponse.prediction_id}` : 'ML model output with confidence intervals'}</CardDescription></CardHeader>
              <CardContent>
                {prediction ? (
                  <div className="space-y-6">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                      <p className="text-sm text-slate-500 mb-2">Treatment Failure Probability</p>
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-90"><circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="12" fill="none" /><circle cx="64" cy="64" r="56" stroke={getRiskColor(prediction.resistanceProbability)} strokeWidth="12" fill="none" strokeDasharray={`${(prediction.resistanceProbability / 100) * 352} 352`} strokeLinecap="round" /></svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col"><span className="text-3xl font-bold" style={{ color: getRiskColor(prediction.resistanceProbability) }}>{prediction.resistanceProbability.toFixed(1)}%</span><span className="text-xs text-slate-500">probability</span></div>
                      </div>
                      <Badge className="mt-3" style={{ backgroundColor: getRiskColor(prediction.resistanceProbability) + '20', color: getRiskColor(prediction.resistanceProbability), borderColor: getRiskColor(prediction.resistanceProbability) }} variant="outline">{risk?.level} RISK</Badge>
                      <p className="text-xs text-slate-500 mt-2">Confidence: {prediction.confidenceLevel.toFixed(1)}%</p>
                    </motion.div>

                    <Tabs defaultValue="factors" className="w-full">
                      <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="factors">Risk Factors</TabsTrigger><TabsTrigger value="timeline">Timeline</TabsTrigger><TabsTrigger value="geo">Geographic</TabsTrigger></TabsList>
                      <TabsContent value="factors" className="mt-4">
                        <div className="space-y-3">
                          {prediction.riskFactors.map((factor, idx) => (<div key={idx} className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg"><AlertTriangle className="w-4 h-4 text-amber-600" /><span className="text-sm text-amber-800">{factor}</span></div>))}
                          {prediction.recommendedAlternatives.length > 0 && (<div className="mt-4"><p className="text-sm font-medium text-slate-700 mb-2">Consider Alternatives:</p>{prediction.recommendedAlternatives.map((alt, idx) => (<div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg mt-2"><CheckCircle2 className="w-4 h-4 text-green-600" /><span className="text-sm text-green-800">{alt}</span></div>))}</div>)}
                        </div>
                      </TabsContent>
                      <TabsContent value="timeline" className="mt-4"><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={prediction.timeline}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} /><YAxis stroke="#64748b" domain={[0, 100]} /><RechartsTooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} /><Line type="monotone" dataKey="probability" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} /></LineChart></ResponsiveContainer></div></TabsContent>
                      <TabsContent value="geo" className="mt-4"><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={prediction.geoRisk} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis type="number" domain={[0, 60]} stroke="#64748b" /><YAxis dataKey="region" type="category" stroke="#64748b" tick={{ fontSize: 11 }} width={100} /><RechartsTooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} /><Bar dataKey="risk" radius={[0, 4, 4, 0]}>{prediction.geoRisk.map((entry, index) => (<Cell key={index} fill={getRiskColor(entry.risk)} />))}</Bar></BarChart></ResponsiveContainer></div></TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center text-slate-400"><Brain className="w-16 h-16 mb-4 opacity-30" /><p className="text-sm">No prediction yet</p><p className="text-xs">Fill in parameters and click "Run Prediction"</p></div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Model Info Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center"><Brain className="w-5 h-5 text-white" /></div><div><p className="text-sm font-semibold text-blue-900">Model: Ensemble</p><p className="text-xs text-blue-600">XGBoost + LR + RF</p></div></div></CardContent></Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div><div><p className="text-sm font-semibold text-green-900">Validation: Temporal</p><p className="text-xs text-green-600">AUC-ROC: 0.847</p></div></div></CardContent></Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center"><Clock className="w-5 h-5 text-white" /></div><div><p className="text-sm font-semibold text-purple-900">Last Updated</p><p className="text-xs text-purple-600">{rawResponse?.created_at ? new Date(rawResponse.created_at).toLocaleDateString() : 'January 2026'}</p></div></div></CardContent></Card>
        </motion.div>

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800"><strong>Important:</strong> This prediction tool is for surveillance and research purposes only. Results represent probabilistic estimates based on molecular and epidemiological data and must not be used as a substitute for clinical judgment or national treatment guidelines.{rawResponse?.disclaimer && <span className="block mt-1">{rawResponse.disclaimer}</span>}</div>
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
