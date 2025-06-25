
import React from 'react';
import { Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const UpgradeHeader = () => {
  return (
    <>
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Crown className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Available Subscriptions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our available subscription plans to unlock more features and grow your business.
        </p>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Need help choosing? <Link to="/contact" className="text-greenyp-600 hover:underline">Contact our support team</Link>
        </p>
      </div>
    </>
  );
};

export default UpgradeHeader;
