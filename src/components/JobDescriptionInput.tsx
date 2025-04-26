import React from 'react';
import { Briefcase } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ 
  value, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-700">Job Description</h3>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        Paste the job description to analyze how well your resume matches the requirements
      </p>
      <textarea
        className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
        placeholder="Paste the job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>For best results, include the full job description</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  );
};

export default JobDescriptionInput;