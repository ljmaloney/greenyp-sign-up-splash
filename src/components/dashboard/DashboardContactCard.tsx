
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Contact } from '@/services/accountService';
import ContactInfo from './ContactInfo';
import ContactMetadata from './ContactMetadata';

interface DashboardContactCardProps {
  contact: Contact;
  title: string;
  icon: React.ElementType;
  onEdit?: (contact: Contact) => void;
}

const DashboardContactCard = ({ contact, title, icon: Icon, onEdit }: DashboardContactCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2 text-greenyp-600">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(contact)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ContactInfo contact={contact} />
        <ContactMetadata contact={contact} />
      </CardContent>
    </Card>
  );
};

export default DashboardContactCard;
