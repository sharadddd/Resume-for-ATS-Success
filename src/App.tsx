import React from 'react';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import ProcessingIndicator from './components/ProcessingIndicator';
import ResumePreview from './components/ResumePreview';
import ScoreCard from './components/ScoreCard';
import SuggestionList from './components/SuggestionList';
import ImprovementTips from './components/ImprovementTips';
import ActionButton from './components/ActionButton';
import { useResumeAnalyzer } from './hooks/useResumeAnalyzer';

function App() {
  const { 
    state, 
    handleFileSelect, 
    handleJobDescriptionChange, 
    clearFile, 
    analyzeResume, 
    resetAnalysis 
  } = useResumeAnalyzer();

  const isAnalysisComplete = state.uploadStatus === 'complete' && state.analysisResult;
  const isProcessing = ['uploading', 'processing', 'analyzing'].includes(state.uploadStatus);
  const canAnalyze = state.file && state.jobDescription.length > 50 && !isProcessing;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderBar />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Optimize Your Resume for ATS Success
          </h1>
          <p className="text-lg text-gray-600">
            Upload your resume, add the job description, and get AI-powered feedback to 
            improve your chances of passing Applicant Tracking Systems.
          </p>
        </div>

        {!isAnalysisComplete ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-6">
              {!state.file ? (
                <FileUpload onFileSelect={handleFileSelect} />
              ) : (
                <ResumePreview 
                  file={state.file} 
                  preview={state.preview} 
                  onRemove={clearFile} 
                />
              )}
              
              <JobDescriptionInput 
                value={state.jobDescription} 
                onChange={handleJobDescriptionChange} 
              />
            </div>
            
            <div className="space-y-6 flex flex-col">
              {state.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                  {state.error}
                </div>
              )}
              
              {state.uploadStatus !== 'idle' && (
                <ProcessingIndicator status={state.uploadStatus} />
              )}
              
              <div className="mt-auto">
                <ActionButton 
                  onClick={analyzeResume} 
                  disabled={!canAnalyze}
                  loading={isProcessing}
                  loadingText={
                    state.uploadStatus === 'uploading'
                      ? 'Uploading...'
                      : state.uploadStatus === 'processing'
                      ? 'Processing PDF...'
                      : 'Analyzing Resume...'
                  }
                  className="w-full"
                >
                  Analyze Resume
                </ActionButton>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Your data is processed securely and never shared with third parties.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Analysis Results
                </h2>
                <button 
                  onClick={resetAnalysis}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Start New Analysis
                </button>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ScoreCard score={state.analysisResult.score} />
                
                <div className="mt-6">
                  <ImprovementTips tips={state.analysisResult.improvementTips} />
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <SuggestionList 
                  feedback={state.analysisResult.feedback} 
                  missingFields={state.analysisResult.missingFields} 
                />
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;