import { useState, useCallback } from 'react';
import { ResumeState, UploadStatus, AnalysisResult } from '../types';
import axios from 'axios';

const initialState: ResumeState = {
  file: null,
  preview: null,
  jobDescription: '',
  uploadStatus: 'idle',
  analysisResult: null,
  error: null,
};

export const useResumeAnalyzer = () => {
  const [state, setState] = useState<ResumeState>(initialState);

  const updateState = useCallback((updates: Partial<ResumeState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (state.preview) {
      URL.revokeObjectURL(state.preview); // Revoke previous URL
    }

    const previewUrl = URL.createObjectURL(file);
    updateState({
      file,
      preview: previewUrl,
      uploadStatus: 'idle',
      analysisResult: null,
      error: null,
    });
  }, [state.preview, updateState]);

  const handleJobDescriptionChange = useCallback((jobDescription: string) => {
    updateState({ jobDescription });
  }, [updateState]);

  const clearFile = useCallback(() => {
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }

    updateState({
      file: null,
      preview: null,
      uploadStatus: 'idle',
      analysisResult: null,
      error: null,
    });
  }, [state.preview, updateState]);

  const analyzeResume = useCallback(async () => {
    if (!state.file || !state.jobDescription) {
      updateState({
        error: 'Please upload a resume and enter a job description',
      });
      return;
    }

    updateState({ uploadStatus: 'uploading', error: null });

    const formData = new FormData();
    formData.append('resume', state.file);
    formData.append('jobDescription', state.jobDescription);
    formData.append('promptType', 'match');

    try {
      updateState({ uploadStatus: 'processing' });

      const response = await axios.post('http://localhost:3000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      updateState({ uploadStatus: 'analyzing' });

      console.log('Server response:', response.data);

      // Check if we have a valid result from the server
      if (!response.data.result) {
        throw new Error('No analysis result received from server');
      }

      // Parse the AI response
      const result = parseAIResponse(response.data.result);
      console.log('Parsed result:', result);

      updateState({
        uploadStatus: 'complete',
        analysisResult: result,
      });
    } catch (error: any) {
      console.error('Analysis error:', error);

      // Log more detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);

      updateState({
        uploadStatus: 'error',
        error: error?.response?.data?.error || error.message || 'Failed to analyze resume. Please try again.',
      });
    }
  }, [state.file, state.jobDescription, updateState]);

  const resetAnalysis = useCallback(() => {
    updateState({
      uploadStatus: 'idle',
      analysisResult: null,
      error: null,
    });
  }, [updateState]);

  return {
    state,
    handleFileSelect,
    handleJobDescriptionChange,
    clearFile,
    analyzeResume,
    resetAnalysis,
  };
};

// Parse the AI response text into a structured format
function parseAIResponse(aiResponse: string): AnalysisResult {
  try {
    console.log('Parsing AI response text:', aiResponse.substring(0, 200) + '...');

    // For now, we'll use the mock data but log the actual response
    // In a production environment, you would parse the text response
    // into a structured format based on the expected output from the AI

    // This is a fallback to ensure the app doesn't crash
    // while we're debugging the API integration
    return {
      score: {
        overall: Math.floor(65 + Math.random() * 20),
        keywords: Math.floor(60 + Math.random() * 30),
        experience: Math.floor(55 + Math.random() * 35),
        education: Math.floor(70 + Math.random() * 25),
        skills: Math.floor(50 + Math.random() * 40),
      },
      feedback: [
        {
          section: 'Professional Experience',
          score: Math.floor(60 + Math.random() * 30),
          suggestions: [
            'Quantify your achievements with metrics and numbers',
            'Use more action verbs to describe your responsibilities',
            'Highlight specific technologies and tools you used'
          ],
          missingKeywords: ['React', 'Node.js', 'TypeScript'],
        },
        {
          section: 'Skills',
          score: Math.floor(50 + Math.random() * 35),
          suggestions: [
            'Add more technical skills relevant to the job',
            'Organize skills by categories (technical, soft, etc.)',
          ],
          missingKeywords: ['Docker', 'AWS', 'Kubernetes', 'CI/CD'],
        },
        {
          section: 'Education',
          score: Math.floor(75 + Math.random() * 25),
          suggestions: [],
          missingKeywords: [],
        },
        {
          section: 'Projects',
          score: Math.floor(55 + Math.random() * 30),
          suggestions: [
            'Include more details about your contribution to each project',
            'Mention technologies used in your projects',
          ],
          missingKeywords: ['GraphQL', 'REST'],
        },
      ],
      missingFields: ['Certifications', 'Awards'],
      improvementTips: [
        'Tailor your resume for each job application',
        'Use industry-specific keywords and phrases',
        'Keep your resume formatting consistent and ATS-friendly',
        'Highlight accomplishments rather than just listing responsibilities',
        'Remove outdated or irrelevant experience'
      ],
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse analysis results');
  }
}
