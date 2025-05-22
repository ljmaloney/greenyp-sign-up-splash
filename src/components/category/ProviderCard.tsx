
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star } from 'lucide-react';

export interface Provider {
  name: string;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
}

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard = ({ provider }: ProviderCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="font-bold text-xl mb-2">{provider.name}</h3>
      
      <div className="flex items-center mb-3">
        <div className="flex items-center">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          <span className="ml-1 font-medium">{provider.rating}</span>
        </div>
        <span className="text-gray-500 text-sm ml-2">({provider.reviews} reviews)</span>
      </div>
      
      <div className="flex items-start mb-2">
        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
        <span className="text-gray-600">{provider.location}</span>
      </div>
      
      <div className="flex items-start mb-4">
        <Phone className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
        <span className="text-gray-600">{provider.phone}</span>
      </div>
      
      <Button className="w-full bg-greenyp-600 hover:bg-greenyp-700 text-white mt-2">
        View Profile
      </Button>
    </div>
  );
};

export default ProviderCard;
