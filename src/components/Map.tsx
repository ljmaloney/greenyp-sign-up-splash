
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  latitude: string;
  longitude: string;
  businessName: string;
}

const Map = ({ latitude, longitude, businessName }: MapProps) => {
  const handleMapClick = () => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div 
      className="w-32 h-24 bg-gray-100 border border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleMapClick}
      title={`View ${businessName} on Google Maps`}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
        <MapPin className="w-6 h-6 text-greenyp-600 mb-1" />
        <p className="text-xs text-gray-600 leading-tight">Click to view map</p>
      </div>
    </div>
  );
};

export default Map;
