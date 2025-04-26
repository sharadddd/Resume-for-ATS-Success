import React from 'react';
import { FileText } from 'lucide-react';

const HeaderBar: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-7 w-7" />
          <h1 className="text-xl font-bold">ResumeAI Analyzer</h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <span className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            How it works
          </span>
          <span className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            Features
          </span>
          <span className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            FAQ
          </span>
        </div>
        <button className="bg-white text-blue-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
          Sign Up Free
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;