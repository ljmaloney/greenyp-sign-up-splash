
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Mail, Phone, Eye } from 'lucide-react';
import { Classified } from '@/types/classifieds';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAdPackages } from '@/hooks/classifieds/useAdPackages';
import ContactSellerDialog from './ContactSellerDialog';

interface ClassifiedCardProps {
  classified: Classified;
}

const ClassifiedCard = ({ classified }: ClassifiedCardProps) => {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const { data: adPackagesData } = useAdPackages();
  
  // Find the ad package for this classified
  const adPackage = adPackagesData?.response?.find(pkg => pkg.adTypeId === classified.pricingTier);
  const hasProtectedContact = adPackage?.features?.protectContact || false;

  const formatContact = (contact: string, type: 'email' | 'phone') => {
    if (!classified.contactObfuscated) {
      return contact;
    }
    
    if (type === 'email') {
      const [username, domain] = contact.split('@');
      return `${username.slice(0, 2)}***@${domain}`;
    } else {
      return `${contact.slice(0, 3)}***${contact.slice(-4)}`;
    }
  };

  const handleContactSeller = () => {
    if (hasProtectedContact) {
      setShowContactDialog(true);
    } else {
      window.open(`mailto:${classified.email}`, '_blank');
    }
  };

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Card className="hover:shadow-md hover:border-yellow-500 transition-all duration-200 flex flex-col h-full border-2">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 text-left flex-1">{classified.title}</h3>
            <Badge variant="secondary" className="ml-2">{classified.category}</Badge>
          </div>
          
          <div className="flex justify-between items-start">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1 text-greenyp-600" />
              {classified.city}, {classified.state} {classified.zipCode}
              {classified.distance && (
                <span className="ml-2 text-greenyp-600 font-medium">
                  ({classified.distance} mi)
                </span>
              )}
            </div>
            {classified.price && classified.perUnitType && (
              <div className="text-sm font-medium text-greenyp-600">
                ${classified.price} per {classified.perUnitType}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-grow flex flex-col">
          {classified.images.length > 0 && (
            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={classified.images[0]} 
                alt={classified.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-gray-700 text-sm line-clamp-3 flex-grow text-left">
            {truncateDescription(classified.description)}
          </p>

          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-greenyp-600" />
              <span className="text-gray-600">
                {formatContact(classified.email, 'email')}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-2 text-greenyp-600" />
              <span className="text-gray-600">
                {formatContact(classified.phone, 'phone')}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-4 space-y-2">
            <Link 
              to={`/classifieds/detail/${classified.id}`}
              state={{ fromSearch: window.location.pathname.includes('/search') }}
            >
              <Button 
                variant="outline" 
                className="w-full border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                View More
              </Button>
            </Link>
            <Button 
              className="w-full bg-greenyp-600 hover:bg-greenyp-700"
              onClick={handleContactSeller}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Seller
            </Button>
          </div>
        </CardContent>
      </Card>

      <ContactSellerDialog
        isOpen={showContactDialog}
        onOpenChange={setShowContactDialog}
        classified={classified}
      />
    </>
  );
};

export default ClassifiedCard;
