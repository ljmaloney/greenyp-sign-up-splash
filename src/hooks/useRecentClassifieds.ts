
import { useQuery } from '@tanstack/react-query';
import { Classified } from '@/types/classifieds';

// Mock data for recent classifieds
const mockRecentClassifieds: Classified[] = [
  {
    id: '4',
    title: 'Vintage Guitar - Fender Stratocaster',
    description: '1975 Fender Stratocaster in great condition. Perfect for collectors or professional musicians.',
    category: 'Electronics',
    zipCode: '90210',
    email: 'guitarist@email.com',
    phone: '(555) 111-2222',
    images: [],
    pricingTier: 'basic',
    contactObfuscated: false,
    createdAt: '2024-01-20T14:00:00Z',
    expiresAt: '2024-02-20T14:00:00Z'
  },
  {
    id: '5',
    title: 'Apartment for Rent - Downtown',
    description: 'Beautiful 2BR/2BA apartment in downtown area. Walking distance to restaurants and shopping.',
    category: 'Real Estate',
    zipCode: '10001',
    email: 'landlord@email.com',
    phone: '(555) 333-4444',
    images: [],
    pricingTier: 'standard',
    contactObfuscated: false,
    createdAt: '2024-01-19T11:30:00Z',
    expiresAt: '2024-02-19T11:30:00Z'
  },
  {
    id: '6',
    title: 'Dog Walking Services Available',
    description: 'Experienced pet sitter offering dog walking and pet care services. Flexible schedule and competitive rates.',
    category: 'Services',
    zipCode: '33101',
    email: 'petcare@email.com',
    phone: '(555) 555-6666',
    images: [],
    pricingTier: 'basic',
    contactObfuscated: false,
    createdAt: '2024-01-18T16:45:00Z',
    expiresAt: '2024-02-18T16:45:00Z'
  }
];

const fetchRecentClassifieds = async (): Promise<Classified[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Sort by creation date (most recent first)
  return mockRecentClassifieds.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const useRecentClassifieds = () => {
  return useQuery({
    queryKey: ['recent-classifieds'],
    queryFn: fetchRecentClassifieds,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
