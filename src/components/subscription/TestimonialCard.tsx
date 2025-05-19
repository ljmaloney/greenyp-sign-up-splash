
import React from 'react';

export interface TestimonialProps {
  name: string;
  company: string;
  content: string;
  initials: string;
}

const TestimonialCard = ({ name, company, content, initials }: TestimonialProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-greenyp-200 flex items-center justify-center text-greenyp-700 font-bold text-xl mr-4">
          {initials}
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-600">{company}</p>
        </div>
      </div>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

export default TestimonialCard;
