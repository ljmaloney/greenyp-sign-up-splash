
import React from 'react';

export interface FAQProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQProps) => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{question}</h3>
      <p className="text-gray-700">{answer}</p>
    </div>
  );
};

export default FAQItem;
