
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuickLinksCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-greenyp-800 text-center">Quick Links</CardTitle>
      </CardHeader>
        <CardContent className="space-y-3">
         <div>
             Contact us in one of two ways: use one of the links below, or fill out our contact form below.
             In either case we will get back to you as soon as possible.
         </div>
          <div>
          <p className="text-gray-600 text-lg text-left">
            <span className="font-semibold text-gray-900 mb-2">For New Businesses : </span>
            Ready to get started? <a href="/signup" className="text-greenyp-600 hover:underline">Sign up here</a> or
            browse our <a href="/subscribe" className="text-greenyp-600 hover:underline">pricing plans</a>.
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-lg text-left">
            <span className="font-semibold text-gray-900 mb-2">Technical Support : </span>
            Need help with your listing? Email us at{' '}
            <a href="mailto:support@greenyp.com?subject=Technical Support Request - " className="text-greenyp-600 hover:underline">
              support@greenyp.com
            </a>
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-lg text-left">
            <span className="font-semibold text-gray-900 mb-2">Premium Services : </span>
            Interested in premium features? Contact our sales team at{' '}
            <a href="mailto:sales@greenyp.com?subject=Premium Features -" className="text-greenyp-600 hover:underline">
              sales@greenyp.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLinksCard;
