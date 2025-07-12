
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ConfirmationActions = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      <Button asChild className="bg-green-600 hover:bg-green-700">
        <Link to="/dashboard" className="flex items-center">
          Access Your Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/">
          Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default ConfirmationActions;
