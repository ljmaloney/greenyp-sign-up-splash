
import React from 'react';
import { User, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ListingDetailsCardProps {
  contactName: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  cellPhone: string;
  locationName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  website: string;
}

const ListingDetailsCard = ({
  contactName,
  firstName,
  lastName,
  title,
  email,
  phone,
  cellPhone,
  locationName,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  website
}: ListingDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-green-800">Your Listing Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            Contact Information
          </h3>
          <div className="pl-6 space-y-2">
            <div>
              <p className="text-sm text-gray-600">Primary Contact</p>
              <p className="font-semibold">
                {contactName || `${firstName} ${lastName}`.trim()}
              </p>
            </div>
            {title && (
              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="font-semibold">{title}</p>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{phone}</span>
            </div>
            {cellPhone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{cellPhone} (Cell)</span>
              </div>
            )}
          </div>
        </div>

        {/* Location Information Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            Location Information
          </h3>
          <div className="pl-6 space-y-2">
            {locationName && (
              <div>
                <p className="text-sm text-gray-600">Location Name</p>
                <p className="font-semibold">{locationName}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <div className="font-semibold">
                {addressLine1 && <p>{addressLine1}</p>}
                {addressLine2 && <p>{addressLine2}</p>}
                <p>{city}, {state} {postalCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Website Information */}
        {website && (
          <div className="flex items-center space-x-3">
            <Globe className="h-4 w-4 text-gray-500" />
            <span>{website}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListingDetailsCard;
