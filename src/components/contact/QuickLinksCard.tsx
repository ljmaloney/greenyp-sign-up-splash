
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
          <p className="text-gray-600 text-sm">
            Ready to get started? <a href="/signup" className="text-greenyp-600 hover:underline">Sign up here</a> or 
            browse our <a href="/subscribe" className="text-greenyp-600 hover:underline">pricing plans</a>.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Technical Support</h4>
          <p className="text-gray-600 text-sm">
            Need help with your listing? Email us at{' '}
            <a href="mailto:support@greenyp.com" className="text-greenyp-600 hover:underline">
              support@greenyp.com
            </a>
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Premium Services</h4>
          <p className="text-gray-600 text-sm">
            Interested in premium features? Contact our sales team at{' '}
            <a href="mailto:sales@greenyp.com" className="text-greenyp-600 hover:underline">
              sales@greenyp.com
            </a>
          </p>
        </div>
        <div className="pt-4 border-t">
          <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
          <p className="text-gray-600 text-sm mb-1">
            <strong>Email:</strong> info@greenyp.com | sales@greenyp.com
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Business Hours:</strong><br />
            Monday - Friday: 9:00 AM - 6:00 PM EST<br />
            Saturday: 10:00 AM - 4:00 PM EST<br />
            Sunday: Closed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLinksCard;
