
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SignUpHeader from '@/components/SignUpHeader';
import Footer from '@/components/Footer';
import SignUpForm from '@/components/signup/SignUpForm';

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan') || '';

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
