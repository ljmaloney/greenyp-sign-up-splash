
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NextStepsCard = () => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl text-green-800">What's Next?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Check Your Email</h3>
            <p className="text-sm text-gray-600">
              We've sent a welcome email with your login credentials and next steps.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Complete Your Profile</h3>
            <p className="text-sm text-gray-600">
              Add photos, services, and additional details to make your listing stand out.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Start Getting Leads</h3>
            <p className="text-sm text-gray-600">
              Your listing will be live within 24 hours and customers can start finding you.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextStepsCard;
