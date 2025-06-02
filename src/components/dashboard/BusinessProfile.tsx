
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin, Globe, Edit } from 'lucide-react';
import EditBusinessProfileDialog from './EditBusinessProfileDialog';

const BusinessProfile = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Mock business data - in real app this would come from API
  const businessData = {
    businessName: 'Green Landscaping Pro',
    contactName: 'John Smith',
    email: 'john@greenlandscaping.com',
    phone: '(555) 123-4567',
    address: '123 Garden Street, San Francisco, CA 94102',
    website: 'www.greenlandscaping.com',
    description: 'Professional landscaping services specializing in sustainable garden design and maintenance.'
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
        <Button 
          className="bg-greenyp-600 hover:bg-greenyp-700"
          onClick={() => setIsEditDialogOpen(true)}
        >
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

      <EditBusinessProfileDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        businessData={businessData}
      />
    </div>
  );
};

export default BusinessProfile;
