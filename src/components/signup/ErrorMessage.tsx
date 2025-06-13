
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="bg-red-50 border-2 border-red-800 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-800 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-red-800">
          <p className="font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
