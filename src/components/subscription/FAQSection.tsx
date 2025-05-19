
import React from 'react';
import FAQItem from './FAQItem';

const faqs = [
  {
    question: "How do I get my business listed?",
    answer: "Simply sign up and complete your business profile. The basic listing is free and takes only a few minutes to set up. For enhanced visibility, consider our premium options."
  },
  {
    question: "Can I upgrade my subscription later?",
    answer: "Yes, you can upgrade or downgrade your subscription at any time. Changes will be reflected immediately in your account features and billing."
  },
  {
    question: "How do customers find my business?",
    answer: "Customers can find your business by searching categories, services, or locations. Premium subscribers appear higher in search results and have enhanced profile features."
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No long-term contracts. Our premium plans are month-to-month and you can cancel at any time. The free basic listing has no time limit."
  }
];

const FAQSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
