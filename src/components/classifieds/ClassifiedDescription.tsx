
import React from 'react';

interface ClassifiedDescriptionProps {
  description: string;
}

const ClassifiedDescription = ({ description }: ClassifiedDescriptionProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Description</h3>
      <div className="text-gray-700 text-left whitespace-pre-wrap leading-relaxed">
        {description}
      </div>
    </div>
  );
};

export default ClassifiedDescription;
