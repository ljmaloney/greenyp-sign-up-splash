
import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface ClassifiedDescriptionProps {
  description: string;
}

const ClassifiedDescription = ({ description }: ClassifiedDescriptionProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Description</h3>
        <MDEditor.Markdown
            source={description}
            style={{ backgroundColor: 'transparent' }}
        />
    </div>
  );
};

export default ClassifiedDescription;
