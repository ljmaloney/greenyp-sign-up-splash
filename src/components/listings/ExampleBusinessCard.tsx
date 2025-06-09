
import React from 'react';
import { MapPin, Phone, Globe, ExternalLink, Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ExampleBusinessCard = () => {
  return (
    <div className="max-w-md mx-auto">
      <Card className="hover:shadow-md transition-shadow border-2 border-dashed border-greenyp-300">
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <Building2 className="w-8 h-8 mr-3 text-greenyp-600 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              Your Business Name Here
            </h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Your City, State</span>
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">(555) 123-4567</span>
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate flex items-center">
                www.yourbusiness.com
                <ExternalLink className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
          
          <Button className="w-full bg-greenyp-600 hover:bg-greenyp-700 text-white">
            View Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExampleBusinessCard;
