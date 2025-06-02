
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Subscription = () => {
  // Mock current subscription
  const currentSubscription = {
    name: 'Basic Listing',
    price: '$5/month',
    features: [
      'Business Hours',
      'Basic business listing',
      'Single category listing',
      'Map Location',
      'Contact Information'
    ]
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-greenyp-600" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{currentSubscription.name}</h3>
                <p className="text-2xl font-bold text-greenyp-600">{currentSubscription.price}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Features included:</h4>
                <ul className="space-y-1">
                  {currentSubscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need More Features?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Upgrade to unlock additional features like product listings, services catalog, and enhanced visibility.
              </p>
              
              <Button asChild className="bg-greenyp-600 hover:bg-greenyp-700 w-full">
                <Link to="/subscriber/subscribe">
                  View All Plans
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full">
                Cancel Subscription
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
