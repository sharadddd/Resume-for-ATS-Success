import React from 'react';
import { Lightbulb } from 'lucide-react';

interface ImprovementTipsProps {
  tips: string[];
}

const ImprovementTips: React.FC<ImprovementTipsProps> = ({ tips }) => {
  if (!tips.length) return null;
  
  return (
    <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 w-full">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-blue-800">General Improvement Tips</h3>
      </div>
      
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 text-xs flex items-center justify-center font-medium">
              {index + 1}
            </span>
            <span className="text-blue-700">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImprovementTips;