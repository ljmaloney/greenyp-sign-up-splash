
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Mail, Phone } from 'lucide-react';
import { Classified } from '@/types/classifieds';
import { format } from 'date-fns';

interface ClassifiedCardProps {
  classified: Classified;
}

const ClassifiedCard = ({ classified }: ClassifiedCardProps) => {
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

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{classified.title}</h3>
          <Badge variant="secondary">{classified.category}</Badge>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {classified.zipCode}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(classified.createdAt), 'MMM dd')}
          </div>
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

        <p className="text-gray-700 text-sm line-clamp-3 flex-grow">
          {classified.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-600">
              {formatContact(classified.email, 'email')}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-600">
              {formatContact(classified.phone, 'phone')}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(`mailto:${classified.email}`, '_blank')}
          >
            Contact Seller
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassifiedCard;
