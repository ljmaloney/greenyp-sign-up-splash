
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SubscriberTableRow from './SubscriberTableRow';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscriptionType: string;
  status: string;
  joinDate: string;
  lastActivity: string;
}

interface SubscriberTableProps {
  subscribers: Subscriber[];
  showRecent: boolean;
}

const SubscriberTable = ({ subscribers, showRecent }: SubscriberTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscribers ({subscribers.length})</CardTitle>
        <CardDescription>
          {showRecent ? 'Recent subscribers from the last 30 days' : 'All subscribers in the system'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <SubscriberTableRow key={subscriber.id} subscriber={subscriber} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SubscriberTable;
