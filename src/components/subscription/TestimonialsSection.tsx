
import React from 'react';
import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    name: "Jessica Smith",
    company: "Sunshine Nursery",
    initials: "JS",
    content: "\"Since listing our nursery on GreenYP, we've seen a 40% increase in new customers. The platform is easy to use and the customer support is excellent.\""
  },
  {
    name: "Michael Thompson",
    company: "Green Thumb Landscaping",
    initials: "MT",
    content: "\"The premium subscription has been worth every penny. Our business shows up at the top of search results and the analytics dashboard helps us understand our customer base better.\""
  },
  {
    name: "Amanda Rodriguez",
    company: "Blooming Gardens",
    initials: "AR",
    content: "\"As a small plant nursery, GreenYP has helped us compete with larger stores. The customer targeting is precise and we're reaching people who are specifically looking for our specialty plants.\""
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
          What Our Subscribers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              company={testimonial.company}
              content={testimonial.content}
              initials={testimonial.initials}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
