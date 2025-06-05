import React from 'react';
import { AlertCircle } from 'lucide-react';
interface ErrorDisplayProps {
    error: string;
    className?: string;
  }
  
  const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, className = "" }) => (
    <div className={`flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg ${className}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );

  export default ErrorDisplay;