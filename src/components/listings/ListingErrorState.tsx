
import React from 'react';

interface ListingErrorStateProps {
  error: Error;
}

const ListingErrorState = ({ error }: ListingErrorStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-red-600 mb-4">
        Unable to load recent listings. This might be due to network connectivity issues.
      </p>
      <p className="text-gray-600 mb-4 text-sm">
        Error details: {error.message}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded"
      >
        Retry
      </button>
    </div>
  );
};

export default ListingErrorState;
