
export interface Invoice {
  id: string;
  subscriberName: string;
  email: string;
  phone: string;
  producerId: string;
  amount: number;
  subscriptionType: string;
  paymentDate: string;
  status: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    subscriberName: 'Green Valley Nursery',
    email: 'contact@greenvalley.com',
    phone: '(555) 123-4567',
    producerId: 'PROD-001',
    amount: 89.99,
    subscriptionType: 'Premium',
    paymentDate: '2024-06-09',
    status: 'Paid'
  },
  {
    id: 'INV-002',
    subscriberName: 'Urban Garden Design',
    email: 'info@urbangardens.com',
    phone: '(555) 234-5678',
    producerId: 'PROD-002',
    amount: 29.99,
    subscriptionType: 'Basic',
    paymentDate: '2024-06-08',
    status: 'Paid'
  },
  {
    id: 'INV-003',
    subscriberName: 'EcoScape Solutions',
    email: 'hello@ecoscape.com',
    phone: '(555) 345-6789',
    producerId: 'PROD-003',
    amount: 199.99,
    subscriptionType: 'Enterprise',
    paymentDate: '2024-06-07',
    status: 'Paid'
  },
  {
    id: 'INV-004',
    subscriberName: 'Natural Landscaping Co',
    email: 'sales@naturallc.com',
    phone: '(555) 456-7890',
    producerId: 'PROD-004',
    amount: 89.99,
    subscriptionType: 'Premium',
    paymentDate: '2024-06-06',
    status: 'Pending'
  },
  {
    id: 'INV-005',
    subscriberName: 'Sustainable Gardens LLC',
    email: 'team@sustainablegardens.com',
    phone: '(555) 567-8901',
    producerId: 'PROD-005',
    amount: 29.99,
    subscriptionType: 'Basic',
    paymentDate: '2024-06-05',
    status: 'Failed'
  },
  {
    id: 'INV-006',
    subscriberName: 'Botanical Landscapes',
    email: 'info@botanical.com',
    phone: '(555) 678-9012',
    producerId: 'PROD-006',
    amount: 199.99,
    subscriptionType: 'Enterprise',
    paymentDate: '2024-05-15',
    status: 'Paid'
  },
  {
    id: 'INV-007',
    subscriberName: 'Garden Innovations',
    email: 'contact@gardeninnovations.com',
    phone: '(555) 789-0123',
    producerId: 'PROD-007',
    amount: 89.99,
    subscriptionType: 'Premium',
    paymentDate: '2024-04-20',
    status: 'Paid'
  },
  {
    id: 'INV-008',
    subscriberName: 'Nature Works LLC',
    email: 'hello@natureworks.com',
    phone: '(555) 890-1234',
    producerId: 'PROD-008',
    amount: 29.99,
    subscriptionType: 'Basic',
    paymentDate: '2024-03-10',
    status: 'Paid'
  }
];
