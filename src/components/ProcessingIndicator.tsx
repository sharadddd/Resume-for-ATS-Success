import React from 'react';
import { UploadStatus } from '../types';
import { 
  Upload, 
  Image, 
  LineChart, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';

interface ProcessingIndicatorProps {
  status: UploadStatus;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ status }) => {
  const steps = [
    { key: 'uploading', label: 'Uploading Resume', icon: Upload },
    { key: 'processing', label: 'Converting PDF', icon: Image },
    { key: 'analyzing', label: 'Analyzing Content', icon: LineChart },
    { key: 'complete', label: 'Analysis Complete', icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    if (status === 'idle') return -1;
    if (status === 'error') return -1;
    return steps.findIndex(step => step.key === status);
  };

  const currentStepIndex = getCurrentStepIndex();

  if (status === 'idle') return null;

  if (status === 'error') {
    return (
      <div className="w-full p-4 rounded-lg bg-red-50 border border-red-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <div>
            <h4 className="font-semibold text-red-700">Processing Error</h4>
            <p className="text-sm text-red-600">
              There was an error processing your resume. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ 
              width: currentStepIndex >= 0 
                ? `${(currentStepIndex / (steps.length - 1)) * 100}%` 
                : '0%' 
            }}
          />
        </div>

        <div className="flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index <= currentStepIndex;
            const isCurrentStep = index === currentStepIndex;
            
            return (
              <div key={step.key} className="z-10 flex flex-col items-center">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                    ${isActive ? 'bg-blue-500' : 'bg-gray-200'}
                    ${isCurrentStep ? 'animate-pulse ring-4 ring-blue-100' : ''}`}
                >
                  <StepIcon className={`h-3 w-3 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <span 
                  className={`mt-2 text-xs font-medium transition-colors
                    ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {status === 'analyzing' && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 animate-pulse">
            Using AI to analyze your resume against the job description...
          </p>
        </div>
      )}
    </div>
  );
};

export default ProcessingIndicator;