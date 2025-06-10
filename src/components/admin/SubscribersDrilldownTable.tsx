
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscriptionType: string;
  registrationDate: string;
  status: string;
}

const mockNewSubscribers: Subscriber[] = [
  {
    id: '1',
    name: 'Green Valley Nursery',
    email: 'contact@greenvalley.com',
    phone: '(555) 123-4567',
    subscriptionType: 'Premium',
    registrationDate: '2024-06-08',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Urban Garden Design',
    email: 'info@urbangardens.com',
    phone: '(555) 234-5678',
    subscriptionType: 'Basic',
    registrationDate: '2024-06-07',
    status: 'Active'
  },
  {
    id: '3',
    name: 'EcoScape Solutions',
    email: 'hello@ecoscape.com',
    phone: '(555) 345-6789',
    subscriptionType: 'Enterprise',
    registrationDate: '2024-06-06',
    status: 'Pending'
  },
  {
    id: '4',
    name: 'Natural Landscaping Co',
    email: 'sales@naturallc.com',
    phone: '(555) 456-7890',
    subscriptionType: 'Premium',
    registrationDate: '2024-06-05',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Sustainable Gardens LLC',
    email: 'team@sustainablegardens.com',
    phone: '(555) 567-8901',
    subscriptionType: 'Basic',
    registrationDate: '2024-06-04',
    status: 'Active'
  }
];

const SubscribersDrilldownTable = () => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Pending': return 'secondary';
      case 'Inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Subscribers (Last 5 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockNewSubscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="font-medium">{subscriber.name}</TableCell>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>{subscriber.phone}</TableCell>
                <TableCell>{subscriber.subscriptionType}</TableCell>
                <TableCell>{new Date(subscriber.registrationDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(subscriber.status)}>
                    {subscriber.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SubscribersDrilldownTable;
