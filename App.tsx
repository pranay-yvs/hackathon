import React, { useState, useCallback, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ResultPage } from './components/ResultPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeLeaf } from './services/geminiService';
import type { AnalysisResult, AppState, HistoryEntry } from './types';
import { LANGUAGES } from './constants';
import type { Language } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('agriSentryHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      localStorage.removeItem('agriSentryHistory');
    }
  }, []);

  const handleAnalysis = useCallback(async (imageFile: File, imageDataUrl: string) => {
    setAppState('ANALYZING');
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeLeaf(imageFile, selectedLanguage.name);
      setAnalysisResult(result);
      setAppState('RESULT');

      const newEntry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        imageDataUrl,
        result,
      };

      setHistory(prevHistory => {
        const updatedHistory = [newEntry, ...prevHistory];
        localStorage.setItem('agriSentryHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });

    } catch (err) {
      console.error(err);
      setError('Failed to analyze the image. Please try again.');
      setAppState('IDLE');
    }
  }, [selectedLanguage]);

  const handleReset = () => {
    setAppState('IDLE');
    setAnalysisResult(null);
    setError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('agriSentryHistory');
  };

  const renderContent = () => {
    switch (appState) {
      case 'ANALYZING':
        return <LoadingSpinner language={selectedLanguage}/>;
      case 'RESULT':
        return analysisResult ? (
          <ResultPage result={analysisResult} onReset={handleReset} />
        ) : (
          <HomePage 
            onAnalyze={handleAnalysis} 
            isLoading={false} 
            error={error} 
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            history={history}
            onClearHistory={handleClearHistory}
          />
        );
      case 'IDLE':
      default:
        return (
          <HomePage 
            onAnalyze={handleAnalysis} 
            isLoading={false} 
            error={error}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            history={history}
            onClearHistory={handleClearHistory}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex flex-col items-center justify-center p-4 font-sans">
      <header className="w-full max-w-4xl mx-auto text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800">
          AgriSentry
        </h1>
        <p className="text-lg text-green-700 mt-2">
          Your AI-powered plant health assistant.
        </p>
      </header>
      <main className="w-full max-w-2xl">
        {renderContent()}
      </main>
      <footer className="w-full max-w-4xl mx-auto text-center mt-8 text-sm text-gray-500">
        <p>&copy; 2024 AgriSentry. Helping farmers grow healthier crops.</p>
      </footer>
    </div>
  );
};

export default App;
