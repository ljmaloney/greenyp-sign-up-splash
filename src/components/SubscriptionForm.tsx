import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { useLocation, useNavigate } from 'react-router-dom';

const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract plan and billing period from URL if available
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get('plan') || '';
  const billingPeriod = queryParams.get('billing') || 'monthly';

  useEffect(() => {
    // If plan was selected, show a message
    if (selectedPlan) {
      toast.info(`${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan selected with ${billingPeriod} billing`);
    }
  }, [selectedPlan, billingPeriod]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // Redirect to sign-up page with plan information (using plural form)
    const params = new URLSearchParams();
    params.set('email', email);
    if (businessName) params.set('businessName', businessName);
    if (selectedPlan) params.set('plan', selectedPlan);
    if (billingPeriod) params.set('billing', billingPeriod);
    
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/subscribers/signup?${params.toString()}`);
  };

  const handleStartFreeTrialClick = () => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Updated to use plural form
    navigate('/subscribers/signup');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto w-full">
      {selectedPlan && (
        <Input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Your Business Name"
          className="flex-grow bg-white border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
          required
        />
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your business email"
          className="flex-grow bg-white border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
          required
        />
        <Button 
          type="submit" 
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 whitespace-nowrap"
          disabled={loading}
        >
          {loading ? "Processing..." : selectedPlan ? "Start Your Listing" : "List Your Business"}
        </Button>
      </div>
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        By submitting, you agree to our <a href="/terms" className="underline hover:text-green-600">Terms of Service</a> and <a href="/privacy" className="underline hover:text-green-600">Privacy Policy</a>
      </p>
    </form>
  );
};

export default SubscriptionForm;
