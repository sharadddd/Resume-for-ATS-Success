import React from 'react';
import { ResumeScore } from '../types';

interface ScoreCardProps {
  score: ResumeScore;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  // Function to determine color based on score
  const getColorClass = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Function to determine background color for progress bars
  const getBgColorClass = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Resume Score</h3>
      
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className={getColorClass(score.overall)}
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * score.overall) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              style={{ 
                transformOrigin: 'center',
                transform: 'rotate(-90deg)',
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className={`text-3xl font-bold ${getColorClass(score.overall)}`}>
              {score.overall}%
            </span>
            <span className="text-xs text-gray-500">ATS Score</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(score)
          .filter(([key]) => key !== 'overall')
          .map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize text-gray-700">
                  {key}
                </span>
                <span className={`text-sm font-semibold ${getColorClass(value)}`}>
                  {value}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getBgColorClass(value)} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ScoreCard;