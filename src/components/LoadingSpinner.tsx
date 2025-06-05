import React from 'react';
import { Loader2 } from 'lucide-react';
interface LoadingSpinnerProps {
    className?: string;
  }
  
  const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = "" }) => (
    <Loader2 className={`text-blue-500 animate-spin ${className}`} />
  );

  export default LoadingSpinner;