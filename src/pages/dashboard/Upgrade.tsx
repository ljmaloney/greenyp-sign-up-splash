
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Upgrade = () => {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <Crown className="h-16 w-16 text-yellow-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Upgrade Required</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Access Premium Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              To access products and services management, you need to upgrade to a Featured Business Listing or higher.
            </p>
            
            <div className="space-y-3">
              <div className="text-left">
                <h4 className="font-semibold">Featured Business Listing includes:</h4>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Products listing and management</li>
                  <li>• Services catalog</li>
                  <li>• Enhanced business profile</li>
                  <li>• Photo gallery (up to 15 images)</li>
                  <li>• Priority placement in searches</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-4">
              <Button asChild className="bg-greenyp-600 hover:bg-greenyp-700 w-full">
                <Link to="/subscriber/subscribe">
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Upgrade;
