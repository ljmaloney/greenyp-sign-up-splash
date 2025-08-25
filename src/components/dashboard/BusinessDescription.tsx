
import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

interface BusinessDescriptionProps {
  narrative: string;
  maxLength?: number;
}

const BusinessDescription = ({ narrative, maxLength = 150 }: BusinessDescriptionProps) => {
  const [isNarrativeExpanded, setIsNarrativeExpanded] = useState(false);

  if (!narrative) {
    return null;
  }

  const shouldTruncateNarrative = narrative.length > maxLength;

  return (
    <div className="text-gray-600 mt-2" data-color-mode="light">
      {shouldTruncateNarrative && !isNarrativeExpanded ? (
        <p>
          {narrative.substring(0, maxLength)}...{' '}
          <button
            onClick={() => setIsNarrativeExpanded(!isNarrativeExpanded)}
            className="text-greenyp-600 hover:text-greenyp-700 text-sm underline"
          >
            more
          </button>
        </p>
      ) : (
        <>
          <MDEditor.Markdown 
            source={narrative} 
            style={{ backgroundColor: 'transparent' }}
          />
          {shouldTruncateNarrative && (
            <button
              onClick={() => setIsNarrativeExpanded(!isNarrativeExpanded)}
              className="text-greenyp-600 hover:text-greenyp-700 text-sm mt-1"
            >
              Show less
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default BusinessDescription;
