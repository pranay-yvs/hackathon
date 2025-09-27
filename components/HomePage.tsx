import React, { useState, useRef, useCallback } from 'react';
import { LanguageSelector } from './LanguageSelector';
import type { Language, HistoryEntry } from '../types';
import { HistoryList } from './HistoryList';

interface HomePageProps {
  onAnalyze: (imageFile: File, imageDataUrl: string) => void;
  isLoading: boolean;
  error: string | null;
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  history: HistoryEntry[];
  onClearHistory: () => void;
}

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const HomePage: React.FC<HomePageProps> = ({ onAnalyze, isLoading, error, selectedLanguage, setSelectedLanguage, history, onClearHistory }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyzeClick = () => {
    if (file && preview) {
      onAnalyze(file, preview);
    }
  };
  
  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const triggerCamera = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full transition-all duration-300 ease-in-out">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Get Started</h2>
          <p className="text-gray-500 mb-6">Use your device's camera or webcam to take a picture of a leaf, or upload an image to check its health.</p>
          <div className="mb-4">
            <LanguageSelector selectedLanguage={selectedLanguage} onSelectLanguage={setSelectedLanguage} />
          </div>
        </div>
        
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border-green-400 transition-colors"
          onClick={triggerFileUpload}
        >
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
          
          {preview ? (
            <img src={preview} alt="Leaf preview" className="mx-auto max-h-60 rounded-lg shadow-md" />
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadIcon />
              <p>Click here to upload an image</p>
               <p className="text-sm">or</p>
            </div>
          )}
        </div>
        
         <button
            onClick={triggerCamera}
            className="w-full mt-4 flex items-center justify-center bg-green-100 text-green-800 font-semibold py-3 px-4 rounded-lg hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CameraIcon />
            Use Camera / Webcam
          </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        
        {file && (
          <button
            onClick={handleAnalyzeClick}
            disabled={isLoading || !file}
            className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Leaf'}
          </button>
        )}
      </div>
      <HistoryList history={history} onClearHistory={onClearHistory} />
    </>
  );
};
