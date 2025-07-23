
import React from 'react';

interface SquareCardInputProps {
  cardContainerRef: React.RefObject<HTMLDivElement>;
  error: string | null;
}

const SquareCardInput = ({ cardContainerRef, error }: SquareCardInputProps) => {
  return (
    <div className="space-y-4">
      <div 
        id="card-container" 
        ref={cardContainerRef}
        className="p-4 border border-gray-300 rounded-lg min-h-[120px]"
      />
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default SquareCardInput;
