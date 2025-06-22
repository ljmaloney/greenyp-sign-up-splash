
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuickLinksCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-greenyp-800 text-left">Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">For New Businesses</h4>
          <p className="text-gray-600 text-sm left-0">
            Ready to get started? <a href="/signup" className="text-greenyp-600 hover:underline">Sign up here</a> or 
            browse our <a href="/subscribe" className="text-greenyp-600 hover:underline">pricing plans</a>.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Technical Support</h4>
          <p className="text-gray-600 text-sm left-0">
            Need help with your listing? Email us at{' '}
            <a href="mailto:support@greenyp.com" className="text-greenyp-600 hover:underline">
              support@greenyp.com
            </a>
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Premium Services</h4>
          <p className="text-gray-600 text-sm left-0">
            Interested in premium features? Contact our sales team at{' '}
            <a href="mailto:sales@greenyp.com" className="text-greenyp-600 hover:underline">
              sales@greenyp.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLinksCard;
