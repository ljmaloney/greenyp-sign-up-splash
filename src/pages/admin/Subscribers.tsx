import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, UserPlus, Edit, Trash2, MoreHorizontal, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock subscriber data
const mockSubscribers = [
  {
    id: '1',
    name: 'Green Landscapes Inc.',
    email: 'contact@greenlandscapes.com',
    phone: '(555) 123-4567',
    address: '123 Garden Street, San Francisco, CA 94102',
    subscriptionType: 'Premium',
    status: 'Active',
    joinDate: '2024-01-15',
    lastActivity: '2024-06-09'
  },
  {
    id: '2',
    name: 'Urban Garden Solutions',
    email: 'info@urbangarden.com',
    phone: '(555) 234-5678',
    address: '456 Park Avenue, Oakland, CA 94610',
    subscriptionType: 'Basic',
    status: 'Active',
    joinDate: '2024-02-20',
    lastActivity: '2024-06-08'
  },
  {
    id: '3',
    name: 'Eco Lawn Care',
    email: 'hello@ecolawn.com',
    phone: '(555) 345-6789',
    address: '789 Green Way, Berkeley, CA 94704',
    subscriptionType: 'Enterprise',
    status: 'Inactive',
    joinDate: '2024-03-10',
    lastActivity: '2024-05-25'
  },
  {
    id: '4',
    name: 'Nature Plus Nursery',
    email: 'sales@natureplus.com',
    phone: '(555) 456-7890',
    address: '321 Bloom Street, Palo Alto, CA 94301',
    subscriptionType: 'Premium',
    status: 'Active',
    joinDate: '2024-01-08',
    lastActivity: '2024-06-09'
  },
  {
    id: '5',
    name: 'Garden Masters',
    email: 'contact@gardenmasters.com',
    phone: '(555) 567-8901',
    address: '654 Landscape Blvd, San Jose, CA 95110',
    subscriptionType: 'Basic',
    status: 'Pending',
    joinDate: '2024-06-05',
    lastActivity: 'Never'
  }
];

const AdminSubscribers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showRecent, setShowRecent] = useState(false);
  const [subscribers] = useState(mockSubscribers);

  const filteredAndSortedSubscribers = useMemo(() => {
    let filtered = subscribers;

    // Apply search filter
    if (searchTerm) {
      filtered = subscribers.filter(subscriber => {
        const term = searchTerm.toLowerCase();
        switch (searchType) {
          case 'name':
            return subscriber.name.toLowerCase().includes(term);
          case 'email':
            return subscriber.email.toLowerCase().includes(term);
          case 'phone':
            return subscriber.phone.toLowerCase().includes(term);
          case 'address':
            return subscriber.address.toLowerCase().includes(term);
          case 'all':
          default:
            return (
              subscriber.name.toLowerCase().includes(term) ||
              subscriber.email.toLowerCase().includes(term) ||
              subscriber.phone.toLowerCase().includes(term) ||
              subscriber.address.toLowerCase().includes(term)
            );
        }
      });
    }

    // Apply recent filter (last 30 days)
    if (showRecent) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(subscriber => {
        const joinDate = new Date(subscriber.joinDate);
        return joinDate >= thirtyDaysAgo;
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'lastActivity':
          if (a.lastActivity === 'Never') return 1;
          if (b.lastActivity === 'Never') return -1;
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        default:
          return 0;
      }
    });
  }, [subscribers, searchTerm, searchType, sortBy, showRecent]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'secondary';
      case 'Pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getSubscriptionBadgeVariant = (type: string) => {
    switch (type) {
      case 'Enterprise':
        return 'enterprise';
      case 'Premium':
        return 'default';
      case 'Basic':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscriber Management</h1>
            <p className="text-gray-600 mt-2">
              Search and manage subscriber accounts and subscriptions
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Subscriber
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="address">Address</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="joinDate">Join Date</SelectItem>
              <SelectItem value="lastActivity">Last Activity</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showRecent ? "default" : "outline"}
            onClick={() => setShowRecent(!showRecent)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Recent (30d)
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscribers ({filteredAndSortedSubscribers.length})</CardTitle>
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
                {filteredAndSortedSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSubscribers;
