
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface ProfileHeaderProps {
  businessName: string;
  locationName?: string;
  onBackClick: () => void;
}

const ProfileHeader = ({ businessName, locationName, onBackClick }: ProfileHeaderProps) => {
  return (
    <>
      {/* Back Button */}
      <div className="mb-8">
        <Button 
          variant="outline" 
          className="text-greenyp-600 border-greenyp-600 hover:bg-greenyp-50"
          onClick={onBackClick}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
      </div>

      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{businessName}</h1>
        {locationName && (
          <p className="text-xl text-gray-600">{locationName}</p>
        )}
      </div>
    </>
  );
};

export default ProfileHeader;
