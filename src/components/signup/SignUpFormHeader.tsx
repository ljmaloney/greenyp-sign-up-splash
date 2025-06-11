
import React from 'react';

interface SignUpFormHeaderProps {
  selectedSubscription?: {
    displayName: string;
  };
}

const SignUpFormHeader = ({ selectedSubscription }: SignUpFormHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Create Your GreenYP Account
      </h1>
      <p className="text-lg text-gray-600">
        Join thousands of green industry professionals growing their business
      </p>
      {selectedSubscription && (
        <div className="mt-4 p-3 bg-green-100 rounded-lg">
          <p className="text-green-800 font-medium">
            Selected Plan: {selectedSubscription.displayName}
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUpFormHeader;
