
import React from 'react';
import { CheckCircle } from 'lucide-react';

const ConfirmationHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to GreenYP!
      </h1>
      <p className="text-xl text-gray-600">
        Your account has been successfully created
      </p>
    </div>
  );
};

export default ConfirmationHeader;
