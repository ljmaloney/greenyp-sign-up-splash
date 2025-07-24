
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SignUpHeader from '@/components/SignUpHeader';
import Footer from '@/components/Footer';
import SignUpForm from '@/components/signup/SignUpForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [validationComplete, setValidationComplete] = useState(false);
  
  const selectedPlan = searchParams.get('plan') || '';
  const email = searchParams.get('email') || '';
  const businessName = searchParams.get('businessName') || '';

  console.log('📋 SignUp Page: URL parameter analysis:', {
    selectedPlan,
    email,
    businessName,
    hasAnyParams: selectedPlan || email || businessName,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setValidationComplete(true);
  }, []);

  // Show loading state until validation is complete
  if (!validationComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <SignUpHeader />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p>Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If no plan is provided, show plan selection prompt
  if (!selectedPlan || selectedPlan.trim() === '') {
    console.log('📋 SignUp Page: No plan provided, showing selection prompt');
    
    return (
      <div className="min-h-screen flex flex-col">
        <SignUpHeader />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="bg-white rounded-lg shadow-lg">
              <CardContent className="pt-8 pb-8 text-center space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  To create your business listing, please select a subscription plan that fits your needs.
                </p>
                
                {/* Show pre-filled data if available */}
                {(email || businessName) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left max-w-md mx-auto">
                    <h3 className="font-medium text-green-800 mb-2">We'll save your information:</h3>
                    {email && (
                      <p className="text-sm text-green-700">📧 Email: {email}</p>
                    )}
                    {businessName && (
                      <p className="text-sm text-green-700">🏢 Business: {businessName}</p>
                    )}
                  </div>
                )}

                <div className="space-y-3 max-w-sm mx-auto">
                  <Button 
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (email) params.set('email', email);
                      if (businessName) params.set('businessName', businessName);
                      const queryString = params.toString();
                      navigate(`/subscribers/pricing${queryString ? `?${queryString}` : ''}`);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    View Pricing Plans
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  console.log('📋 SignUp Page: Rendering form with plan:', selectedPlan);

  return (
    <div className="min-h-screen flex flex-col">
      <SignUpHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <SignUpForm selectedPlan={selectedPlan} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
