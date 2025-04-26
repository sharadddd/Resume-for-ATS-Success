import React from 'react';
import { Loader2 } from 'lucide-react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  loadingText = 'Processing...',
  className = '',
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
        ${disabled || loading 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'}
        ${className}`}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
      {loading ? loadingText : children}
    </button>
  );
};

export default ActionButton;