
import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone } from 'lucide-react';
import { ProfileData } from '@/types/profile';

interface ActionButtonsProps {
  profile: ProfileData;
}

const ActionButtons = ({ profile }: ActionButtonsProps) => {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">
        Get Quote
      </Button>
      <Button variant="outline" className="border-greenyp-600 text-greenyp-700">
        Save to Favorites
      </Button>
      {profile.phoneNumber && (
        <Button variant="outline" asChild>
          <a href={`tel:${profile.phoneNumber}`}>
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </a>
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
