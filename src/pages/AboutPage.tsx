
import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About GreenYP</h1>
            <p className="text-xl text-gray-600">Connecting you with green industry professionals</p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                GreenYP is dedicated to connecting homeowners and businesses with trusted green industry professionals. 
                Whether you need landscaping, lawn care, garden centers, or tree services, we make it easy to find 
                qualified providers in your area.
              </p>

              <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
              <p className="text-gray-600 mb-6">
                Our platform serves as a comprehensive directory for green industry services, helping you:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Find local landscaping and lawn care professionals</li>
                <li>Discover garden centers and nurseries near you</li>
                <li>Connect with tree service specialists</li>
                <li>Browse irrigation and outdoor lighting experts</li>
                <li>Access a wide range of green industry services</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">For Professionals</h2>
              <p className="text-gray-600">
                If you're a green industry professional, GreenYP offers subscription plans to help you reach more 
                customers and grow your business. Join our network of trusted providers and expand your reach 
                in the green industry market.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
