
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin, Globe, Edit } from 'lucide-react';

const BusinessProfile = () => {
  // Mock business data - in real app this would come from API
  const businessData = {
    businessName: 'Green Landscaping Pro',
    contactName: 'John Smith',
    email: 'john@greenlandscaping.com',
    phone: '(555) 123-4567',
    address: '123 Garden Street, San Francisco, CA 94102',
    website: 'www.greenlandscaping.com',
    description: 'Professional landscaping services specializing in sustainable garden design and maintenance.',
    businessHours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed'
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
        <Button className="bg-greenyp-600 hover:bg-greenyp-700">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-greenyp-600" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Business Name</label>
              <p className="text-gray-900">{businessData.businessName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Contact Name</label>
              <p className="text-gray-900">{businessData.contactName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-gray-900">{businessData.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-greenyp-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{businessData.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{businessData.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{businessData.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-gray-500" />
              <span>{businessData.website}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {Object.entries(businessData.businessHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-medium capitalize">{day}</span>
                <span className="text-gray-600">{hours}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessProfile;
