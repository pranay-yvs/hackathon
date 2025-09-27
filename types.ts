
export type AppState = 'IDLE' | 'ANALYZING' | 'RESULT';

export interface AnalysisResult {
  isHealthy: boolean;
  diseaseName: string;
  riskLevel: number;
  treatmentAdvice: string[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}
