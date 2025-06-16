
import React, { useState } from 'react';

interface BusinessDescriptionProps {
  narrative: string;
}

const BusinessDescription = ({ narrative }: BusinessDescriptionProps) => {
  const [isNarrativeExpanded, setIsNarrativeExpanded] = useState(false);

  if (!narrative) {
    return null;
  }

  const shouldTruncateNarrative = narrative.length > 150;
  const displayedNarrative = shouldTruncateNarrative && !isNarrativeExpanded 
    ? narrative.substring(0, 150) + '...'
    : narrative;

  return (
    <div className="text-gray-600 mt-2">
      <p>{displayedNarrative}</p>
      {shouldTruncateNarrative && (
        <button
          onClick={() => setIsNarrativeExpanded(!isNarrativeExpanded)}
          className="text-greenyp-600 hover:text-greenyp-700 text-sm mt-1"
        >
          {isNarrativeExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default BusinessDescription;
