
import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';
import type { Language } from '../types';

interface LoadingSpinnerProps {
    language: Language;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ language }) => {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const messages = LOADING_MESSAGES[language.name] || LOADING_MESSAGES['English'];
    setMessage(messages[0]);
    let messageIndex = 0;
    
    const intervalId = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setMessage(messages[messageIndex]);
    }, 2500);

    return () => clearInterval(intervalId);
  }, [language]);

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-lg">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-green-600 rounded-full animate-spin"></div>
        <div className="absolute inset-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.721 4.721a.75.75 0 01.043 1.06l-5.25 6.563a.75.75 0 01-1.06.043L8.22 9.56a.75.75 0 011.06-1.06l2.122 2.122 4.75-5.938a.75.75 0 011.06-.043z" />
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z" clipRule="evenodd" />
            </svg>
        </div>
      </div>
      <p className="mt-6 text-lg text-gray-600 font-medium text-center">{message}</p>
    </div>
  );
};
