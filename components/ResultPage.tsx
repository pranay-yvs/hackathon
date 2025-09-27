import React from 'react';
import type { AnalysisResult } from '../types';
import { RiskChart } from './RiskChart';

interface ResultPageProps {
  result: AnalysisResult;
  onReset: () => void;
}

const HealthyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DiseasedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.367a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const Pill: React.FC<{ text: string; className: string }> = ({ text, className }) => (
    <span className={`px-4 py-1 text-sm font-semibold rounded-full ${className}`}>
        {text}
    </span>
);

export const ResultPage: React.FC<ResultPageProps> = ({ result, onReset }) => {
  const { isHealthy, diseaseName, riskLevel, treatmentAdvice, accuracy, pesticideSuggestions } = result;
  
  const canShare = typeof navigator.share === 'function';

  const handleShare = async () => {
    let shareText = `🌿 AgriSentry Analysis Report 🌿\n\n`;
    shareText += `Status: ${isHealthy ? '✅ Healthy' : '⚠️ Diseased'}\n`;
    if (!isHealthy) {
        shareText += `Disease: ${diseaseName}\n`;
    }
    shareText += `Risk Level: ${riskLevel}%\n`;
    shareText += `Confidence: ${accuracy.toFixed(1)}%\n\n`;
    shareText += `Get your own plant analysis with AgriSentry.`;

    const shareData = {
      title: 'AgriSentry Plant Analysis Result',
      text: shareText,
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Share failed:', err);
    }
  };


  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full animate-fade-in">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          {isHealthy ? <HealthyIcon /> : <DiseasedIcon />}
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Analysis Complete</h2>
        {isHealthy ? (
           <Pill text="Healthy" className="bg-green-100 text-green-800 mt-2 inline-block"/>
        ) : (
           <Pill text="Diseased" className="bg-yellow-100 text-yellow-800 mt-2 inline-block"/>
        )}
      </div>
      
      <div className="space-y-6">
        {!isHealthy && (
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-700">Identified Disease</h3>
                <p className="text-xl text-green-700 font-bold">{diseaseName}</p>
            </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700">Diagnosis Accuracy</h3>
            <p className="text-2xl font-bold text-blue-600">{accuracy.toFixed(1)}% Confidence</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-700 mb-2">Disease Risk Level</h3>
          <RiskChart riskLevel={riskLevel} />
        </div>

        {!isHealthy && treatmentAdvice.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700 mb-3">Treatment Suggestions</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {treatmentAdvice.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {!isHealthy && pesticideSuggestions.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700 mb-3">Pesticide Suggestions</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {pesticideSuggestions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}


        {isHealthy && (
             <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-green-800">The leaf appears to be healthy. Keep up the good work!</p>
            </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={onReset}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          Analyze Another Leaf
        </button>
        {canShare && (
            <button
                onClick={handleShare}
                className="w-full flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                aria-label="Share analysis result"
            >
                <ShareIcon />
                Share Analysis
            </button>
        )}
      </div>
    </div>
  );
};
