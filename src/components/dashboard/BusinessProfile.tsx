import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin, Globe, Edit, Upload, Images } from 'lucide-react';
import EditBusinessProfileDialog from './EditBusinessProfileDialog';
import EditBusinessInfoDialog from './EditBusinessInfoDialog';
import EditContactInfoDialog from './EditContactInfoDialog';
import { useSubscriptions } from '@/hooks/useSubscriptions';

const BusinessProfile = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBusinessInfoDialogOpen, setIsBusinessInfoDialogOpen] = useState(false);
  const [isContactInfoDialogOpen, setIsContactInfoDialogOpen] = useState(false);
  const { data: subscriptions } = useSubscriptions();
  
  // Mock business data - in real app this would come from API
  const businessData = {
    businessName: 'Green Landscaping Pro',
    contactName: 'John Smith',
    email: 'john@greenlandscaping.com',
    phone: '(555) 123-4567',
    address: '123 Garden Street, San Francisco, CA 94102',
    website: 'www.greenlandscaping.com',
    description: 'Professional landscaping services specializing in sustainable garden design and maintenance.',
    subscriptionId: 'featured-business-001' // Mock subscription ID
  };

  // Check if current subscription has logo feature
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === businessData.subscriptionId);
  const hasLogoFeature = currentSubscription?.features.some(feature => 
    feature.toLowerCase().includes('logo') || feature.toLowerCase().includes('branding')
  ) || false;

  // Check if current subscription has image gallery feature
  const hasImageFeature = currentSubscription?.features.some(feature => 
    feature.toLowerCase().includes('photo') || 
    feature.toLowerCase().includes('image') || 
    feature.toLowerCase().includes('gallery')
  ) || false;

  const handleLogoUpload = () => {
    if (hasLogoFeature) {
      // In real app, this would open file picker and handle upload
      console.log('Opening logo upload...');
    }
  };

  const handleImageUpload = () => {
    if (hasImageFeature) {
      // In real app, this would open file picker and handle upload
      console.log('Opening image gallery upload...');
    }
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-greenyp-600" />
              Business Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBusinessInfoDialogOpen(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
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
            
            {/* Logo Upload Section */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Business Logo</label>
              <Button
                variant="outline"
                onClick={handleLogoUpload}
                disabled={!hasLogoFeature}
                className={`w-full ${!hasLogoFeature ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="w-4 h-4 mr-2" />
                {hasLogoFeature ? 'Upload Logo' : 'Upload Logo (Upgrade Required)'}
              </Button>
              {!hasLogoFeature && (
                <p className="text-xs text-gray-500 mt-1">
                  Logo upload is available with premium subscriptions
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-greenyp-600" />
              Contact Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsContactInfoDialogOpen(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
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

      {/* Image Gallery Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Images className="w-5 h-5 mr-2 text-greenyp-600" />
            Image Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Business Images</label>
            <Button
              variant="outline"
              onClick={handleImageUpload}
              disabled={!hasImageFeature}
              className={`w-full ${!hasImageFeature ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="w-4 h-4 mr-2" />
              {hasImageFeature ? 'Upload Images' : 'Upload Images (Upgrade Required)'}
            </Button>
            {!hasImageFeature && (
              <p className="text-xs text-gray-500 mt-1">
                Image gallery is available with featured business subscriptions
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <EditBusinessProfileDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        businessData={businessData}
      />

      <EditBusinessInfoDialog 
        isOpen={isBusinessInfoDialogOpen}
        onClose={() => setIsBusinessInfoDialogOpen(false)}
        businessData={{
          businessName: businessData.businessName,
          contactName: businessData.contactName,
          description: businessData.description
        }}
      />

      <EditContactInfoDialog 
        isOpen={isContactInfoDialogOpen}
        onClose={() => setIsContactInfoDialogOpen(false)}
        contactData={{
          email: businessData.email,
          phone: businessData.phone,
          address: businessData.address,
          website: businessData.website
        }}
      />
    </div>
  );
};

export default BusinessProfile;
