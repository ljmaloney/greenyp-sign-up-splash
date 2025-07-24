
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const SupportSection = () => {
  return (
    <div className="text-center mt-8 p-6 bg-blue-50 rounded-lg">
      <h3 className="font-semibold text-blue-900 mb-2">Need Help Getting Started?</h3>
      <p className="text-blue-700 mb-4">
        Our support team is here to help you make the most of your GreenYP listing.
      </p>
      <Button variant="outline" asChild>
        <Link to="/subscriber/contact">
          Contact Support
        </Link>
      </Button>
    </div>
  );
};

export default SupportSection;
