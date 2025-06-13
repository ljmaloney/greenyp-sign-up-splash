
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccountData } from '@/hooks/useAccountData';

const BusinessProfile = () => {
  const { user } = useAuth();
  const { data: accountData, isLoading, error } = useAccountData(user?.id || null);

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

  return (
    <div className="space-y-6">
      {/* Business Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{producer.businessName}</CardTitle>
              <p className="text-gray-600 mt-2">{producer.narrative}</p>
            </div>
            <Badge variant={producer.subscriptionType === 'LIVE_UNPAID' ? 'destructive' : 'default'}>
              {producer.subscriptionType.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Primary Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Primary Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold">{primaryLocation.locationName}</h3>
            <div className="text-gray-600">
              <p>{primaryLocation.addressLine1}</p>
              {primaryLocation.addressLine2 && <p>{primaryLocation.addressLine2}</p>}
              <p>{primaryLocation.city}, {primaryLocation.state} {primaryLocation.postalCode}</p>
            </div>
            <Badge variant="outline">
              {primaryLocation.locationType.replace('_', ' ')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Information */}
      {producer.subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {producer.subscriptions.map((subscription) => (
                <div key={subscription.subscriptionId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{subscription.displayName}</h4>
                      <p className="text-sm text-gray-600">{subscription.shortDescription}</p>
                    </div>
                    <Badge variant="outline">
                      ${subscription.subscriptionAmount}/{subscription.invoiceCycleType.toLowerCase()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <p>{new Date(subscription.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Invoice:</span>
                      <p>{new Date(subscription.nextInvoiceDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {primaryContact && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Primary Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {primaryContact.genericContactName || `${primaryContact.firstName} ${primaryContact.lastName}`}
                </h4>
                {primaryContact.title && <p className="text-sm text-gray-600">{primaryContact.title}</p>}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{primaryContact.phoneNumber}</span>
                  </div>
                  {primaryContact.cellPhoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{primaryContact.cellPhoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{primaryContact.emailAddress}</span>
                    {!primaryContact.emailConfirmed && (
                      <Badge variant="destructive" className="text-xs">Unconfirmed</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {adminContact && adminContact.contactId !== primaryContact?.contactId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Admin Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">{adminContact.firstName} {adminContact.lastName}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{adminContact.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{adminContact.emailAddress}</span>
                    {!adminContact.emailConfirmed && (
                      <Badge variant="destructive" className="text-xs">Unconfirmed</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BusinessProfile;
