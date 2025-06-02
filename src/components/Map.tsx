
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  latitude: string;
  longitude: string;
  businessName: string;
}

const Map = ({ latitude, longitude, businessName }: MapProps) => {
  // For now, we'll create a placeholder map component
  // In a real implementation, you would integrate with Google Maps, Mapbox, or similar
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  
  return (
    <div className="mt-4">
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
        <MapPin className="w-8 h-8 mx-auto text-greenyp-600 mb-2" />
        <p className="text-sm text-gray-600 mb-3">Map Location for {businessName}</p>
        <div className="bg-white border rounded p-2 text-xs text-gray-500">
          Coordinates: {latitude}, {longitude}
        </div>
        <a 
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-greenyp-600 hover:text-greenyp-700 text-sm underline"
        >
          View on Google Maps
        </a>
      </div>
    </div>
  );
};

export default Map;
