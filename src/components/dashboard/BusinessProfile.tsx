import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccountData } from '@/hooks/useAccountData';
import { useLogoUpload } from '@/hooks/useLogoUpload';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Contact } from '@/services/accountService';
import BusinessProfileCard from './BusinessProfileCard';
import PrimaryLocationCard from './PrimaryLocationCard';
import ActiveSubscriptionsCard from './ActiveSubscriptionsCard';
import DashboardContactCard from './contact/DashboardContactCard.tsx';
import EditDashboardContactDialog from './contact/EditDashboardContactDialog.tsx';

const BusinessProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: accountData, isLoading, error } = useAccountData();
  const { data: subscriptions } = useSubscriptions();
  const logoUploadMutation = useLogoUpload();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleLogoUpload = async (file: File) => {
    try {
      await logoUploadMutation.mutateAsync(file);
      toast({
        title: "Logo Uploaded",
        description: "Your business logo has been successfully uploaded",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">Error loading account data</p>
            <p className="text-sm text-gray-600">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!accountData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-600">No account data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { producer, primaryLocation, contacts } = accountData;
  const primaryContact = contacts.find(contact => contact.producerContactType === 'PRIMARY');
  const adminContact = contacts.find(contact => contact.producerContactType === 'ADMIN');

  // Get current subscription ID from producer subscriptions
  const currentSubscriptionId = producer.subscriptions?.[0]?.subscriptionId;
  
  // Find the current subscription details from the subscriptions list
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  
  // Check if subscription includes Photo Gallery feature
  const hasPhotoGalleryFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'gallery') || false;

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  return (
    <div className="space-y-6">
      {/* Business Profile Card - Updated */}
      <BusinessProfileCard 
        producer={producer}
        onLogoUpload={handleLogoUpload}
        isLogoUploading={logoUploadMutation.isPending}
        hasPhotoGalleryFeature={hasPhotoGalleryFeature}
      />

      {/* Primary Location */}
      <PrimaryLocationCard 
        primaryLocation={primaryLocation} 
        producer={producer}
      />

      {/* Active Subscriptions */}
      <ActiveSubscriptionsCard 
        subscriptions={producer.subscriptions} 
        producerSubscriptionType={producer.subscriptionType}
      />

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {primaryContact && (
          <DashboardContactCard 
            contact={primaryContact} 
            title="Primary Contact" 
            icon={Phone}
            onEdit={handleEditContact}
          />
        )}

        {adminContact && adminContact.contactId !== primaryContact?.contactId && (
          <DashboardContactCard 
            contact={adminContact} 
            title="Admin Contact" 
            icon={Mail}
            onEdit={handleEditContact}
          />
        )}
      </div>

      {/* Edit Contact Dialog */}
      {editingContact && (
        <EditDashboardContactDialog
          isOpen={true}
          onClose={() => setEditingContact(null)}
          contact={editingContact}
          locationId={primaryLocation.locationId}
        />
      )}
    </div>
  );
};

export default BusinessProfile;
