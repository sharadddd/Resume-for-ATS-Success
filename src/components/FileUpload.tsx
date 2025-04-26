import React, { useCallback, useState } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.pdf',
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type
      if (!file.type.includes('pdf')) {
        setError('Please upload a PDF file');
        return false;
      }

      // Check file size
      if (file.size > maxSize) {
        setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
        return false;
      }

      setError(null);
      return true;
    },
    [maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, validateFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, validateFile]
  );

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ease-in-out text-center cursor-pointer 
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${error ? 'border-red-300' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center justify-center py-4">
          {error ? (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-500 font-medium">{error}</p>
              <p className="text-gray-500 mt-2">Please try again with a valid PDF file</p>
            </>
          ) : (
            <>
              {isDragging ? (
                <File className="h-12 w-12 text-blue-500 mb-4" />
              ) : (
                <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
              )}
              <p className="text-lg font-medium text-gray-700">
                {isDragging ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-gray-500 mt-2">or click to browse your files</p>
              <p className="text-xs text-gray-400 mt-4">
                Accepted format: PDF (max {maxSize / (1024 * 1024)}MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;