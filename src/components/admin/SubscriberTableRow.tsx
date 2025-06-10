
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getStatusBadgeVariant, getSubscriptionBadgeVariant } from '@/utils/userBadgeUtils';

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

interface SubscriberTableRowProps {
  subscriber: Subscriber;
}

const SubscriberTableRow = ({ subscriber }: SubscriberTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{subscriber.name}</TableCell>
      <TableCell>{subscriber.email}</TableCell>
      <TableCell>{subscriber.phone}</TableCell>
      <TableCell className="max-w-[200px] truncate" title={subscriber.address}>
        {subscriber.address}
      </TableCell>
      <TableCell>
        <Badge variant={getSubscriptionBadgeVariant(subscriber.subscriptionType)}>
          {subscriber.subscriptionType}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(subscriber.status)}>
          {subscriber.status}
        </Badge>
      </TableCell>
      <TableCell>{subscriber.joinDate}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Subscriber
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Subscriber
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default SubscriberTableRow;
