
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for signing up! Check your email to complete registration.");
      setEmail('');
      setLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-grow bg-white border border-gray-300 focus:border-greenyp-500 focus:ring focus:ring-greenyp-200 transition-all"
        required
      />
      <Button 
        type="submit" 
        className="bg-greenyp-600 hover:bg-greenyp-700 text-white font-medium px-6"
        disabled={loading}
      >
        {loading ? "Processing..." : "Get Started"}
      </Button>
    </form>
  );
};

export default SubscriptionForm;
