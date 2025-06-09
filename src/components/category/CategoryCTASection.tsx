
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface CategoryCTASectionProps {
  categoryName: string;
}

const CategoryCTASection = ({ categoryName }: CategoryCTASectionProps) => {
  return (
    <section className="bg-greenyp-100 py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
          Are you a {categoryName} professional?
        </h2>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          List your business in our directory and connect with customers looking for your services
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/subscriber/signup">
            <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">
              List Your Business
            </Button>
          </Link>
          <Link to="/subscriber">
            <Button variant="outline" className="border-greenyp-600 text-greenyp-700">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryCTASection;
