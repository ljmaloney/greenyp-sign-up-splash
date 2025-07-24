
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  // Debug the error message being displayed
  console.log('🚨 ErrorMessage: Displaying error:', {
    message,
    messageLength: message.length,
    messageType: typeof message
  });

  return (
    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-red-800 min-w-0 flex-1">
          <p className="font-medium text-sm leading-relaxed break-words">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
