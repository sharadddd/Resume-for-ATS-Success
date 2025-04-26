import React from 'react';
import { File, X } from 'lucide-react';

interface ResumePreviewProps {
  file: File | null;
  preview: string | null;
  onRemove: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ file, preview, onRemove }) => {
  if (!file) return null;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4 relative">
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 text-white hover:bg-red-600 transition-colors"
        aria-label="Remove file"
      >
        <X size={16} />
      </button>

      <div className="flex items-center gap-3">
        <div className="bg-blue-100 rounded-lg p-2">
          <File className="h-8 w-8 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024).toFixed(1)} KB • PDF
          </p>
        </div>
      </div>

      {preview && (
        <div className="mt-3 border rounded overflow-hidden">
          <img 
            src={preview} 
            alt="Resume preview" 
            className="w-full h-auto object-contain max-h-64" 
          />
        </div>
      )}
    </div>
  );
};

export default ResumePreview;