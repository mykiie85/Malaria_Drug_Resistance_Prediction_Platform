import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Brain, Globe, Shield, 
  Beaker, TrendingUp, Menu, X, Sun, Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportLayer from '@/sections/ReportLayer';
import PredictionLayer from '@/sections/PredictionLayer';
import './App.css';

type Layer = 'report' | 'prediction';

function App() {
  const [activeLayer, setActiveLayer] = useState<Layer>('report');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navItems = [
    { id: 'report' as Layer, label: 'Surveillance Dashboard', icon: Globe, description: 'Real-time resistance monitoring' },
    { id: 'prediction' as Layer, label: 'ML Predictions', icon: Brain, description: 'AI-powered risk assessment' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <Activity className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">
                  Malaria Resistance Intel
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sub-Saharan Africa Surveillance Platform
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeLayer === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveLayer(item.id)}
                  className={`gap-2 ${activeLayer === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25' 
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <div className="px-4 py-3 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveLayer(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeLayer === item.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pb-8">
        <AnimatePresence mode="wait">
          {activeLayer === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReportLayer isActive={true} onNavigate={setActiveLayer} />
            </motion.div>
          )}
          {activeLayer === 'prediction' && (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PredictionLayer isActive={true} onNavigate={setActiveLayer} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Data: WHO, MalariaGEN</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Updated: Jan 2026</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                For surveillance and research purposes only. Not for clinical decision-making.
              </p>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Developed by <span className="font-semibold text-blue-600 dark:text-blue-400">Mike Sanga</span>
              </p>
              <a 
                href="mailto:mykiie85@gmail.com" 
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                mykiie85@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
