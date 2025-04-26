// Define types for the application

export interface ResumeScore {
  overall: number;
  keywords: number;
  experience: number;
  education: number;
  skills: number;
}

export interface ResumeFeedback {
  section: string;
  score: number;
  suggestions: string[];
  missingKeywords: string[];
}

export interface AnalysisResult {
  score: ResumeScore;
  feedback: ResumeFeedback[];
  missingFields: string[];
  improvementTips: string[];
}

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error';

export interface ResumeState {
  file: File | null;
  preview: string | null;
  jobDescription: string;
  uploadStatus: UploadStatus;
  analysisResult: AnalysisResult | null;
  error: string | null;
}