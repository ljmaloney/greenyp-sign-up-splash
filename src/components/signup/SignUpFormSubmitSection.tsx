
import React from 'react';
import { Button } from "@/components/ui/button";

interface SignUpFormSubmitSectionProps {
  loading: boolean;
}

const SignUpFormSubmitSection = ({ loading }: SignUpFormSubmitSectionProps) => {
  return (
    <>
      <div className="flex justify-center pt-6">
        <Button 
          type="submit" 
          className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8 py-3 text-lg"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        By creating an account, you agree to our{' '}
        <a href="/terms" className="underline hover:text-greenyp-600">Terms of Service</a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-greenyp-600">Privacy Policy</a>
      </p>
    </>
  );
};

export default SignUpFormSubmitSection;
