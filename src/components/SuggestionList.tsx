import React from 'react';
import { ResumeFeedback } from '../types';
import { PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';

interface SuggestionListProps {
  feedback: ResumeFeedback[];
  missingFields: string[];
}

const SuggestionList: React.FC<SuggestionListProps> = ({ 
  feedback, 
  missingFields 
}) => {
  return (
    <div className="space-y-6 w-full">
      {missingFields.length > 0 && (
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-2">
                Missing Sections
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {missingFields.map((field, i) => (
                  <li key={i} className="text-amber-700 text-sm">
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {feedback.map((section, index) => (
        <div 
          key={index}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span 
                className={`w-2 h-2 rounded-full ${
                  section.score >= 80 
                    ? 'bg-green-500' 
                    : section.score >= 60 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                }`} 
              />
              <h3 className="font-medium text-gray-800">
                {section.section}
              </h3>
            </div>
            <span 
              className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                section.score >= 80 
                  ? 'bg-green-100 text-green-800' 
                  : section.score >= 60 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {section.score}%
            </span>
          </div>

          <div className="p-4 space-y-4">
            {section.suggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Improvement Suggestions
                </h4>
                <ul className="space-y-2">
                  {section.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <PlusCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.missingKeywords.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {section.missingKeywords.map((keyword, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {section.suggestions.length === 0 && section.missingKeywords.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>This section looks good! No improvements needed.</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionList;