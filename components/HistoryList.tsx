import React from 'react';
import type { HistoryEntry } from '../types';

interface HistoryListProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
}

const HistoryListItem: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
  const { imageDataUrl, date, result } = entry;
  const isHealthy = result.isHealthy;

  return (
    <li className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <img src={imageDataUrl} alt="Analyzed leaf" className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <span 
            className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-yellow-500'}`}
            title={isHealthy ? 'Healthy' : 'Diseased'}
          ></span>
          <p className="font-semibold text-gray-800">{isHealthy ? 'Healthy' : result.diseaseName}</p>
        </div>
        <p className="text-sm text-gray-500">{new Date(date).toLocaleString()}</p>
      </div>
    </li>
  );
};

export const HistoryList: React.FC<HistoryListProps> = ({ history, onClearHistory }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full mt-8 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Analysis History</h2>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
          aria-label="Clear all analysis history"
        >
          Clear History
        </button>
      </div>
      <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {history.map(entry => (
          <HistoryListItem key={entry.id} entry={entry} />
        ))}
      </ul>
    </div>
  );
};
