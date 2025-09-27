
import React, { useState, useCallback } from 'react';
import { HomePage } from './components/HomePage';
import { ResultPage } from './components/ResultPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeLeaf } from './services/geminiService';
import type { AnalysisResult, AppState } from './types';
import { LANGUAGES } from './constants';
import type { Language } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);

  const handleAnalysis = useCallback(async (imageFile: File) => {
    setAppState('ANALYZING');
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeLeaf(imageFile, selectedLanguage.name);
      setAnalysisResult(result);
      setAppState('RESULT');
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

  const renderContent = () => {
    switch (appState) {
      case 'ANALYZING':
        return <LoadingSpinner language={selectedLanguage}/>;
      case 'RESULT':
        return analysisResult ? (
          <ResultPage result={analysisResult} onReset={handleReset} />
        ) : (
          // Fallback in case result is null
          <HomePage 
            onAnalyze={handleAnalysis} 
            isLoading={false} 
            error={error} 
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        );
      case 'IDLE':
      default:
        return (
          <HomePage 
            onAnalyze={handleAnalysis} 
            // Fix: Corrected the `isLoading` prop. When `appState` is 'IDLE', `isLoading` should be `false`. The previous comparison `appState === 'ANALYZING'` was always false within this `case` block, leading to a TypeScript error.
            isLoading={false} 
            error={error}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
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
