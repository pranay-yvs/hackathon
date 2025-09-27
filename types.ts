export type AppState = 'IDLE' | 'ANALYZING' | 'RESULT';

export interface AnalysisResult {
  isHealthy: boolean;
  diseaseName: string;
  riskLevel: number;
  treatmentAdvice: string[];
  accuracy: number;
  pesticideSuggestions: string[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface HistoryEntry {
  id: number;
  date: string;
  imageDataUrl: string;
  result: AnalysisResult;
}
