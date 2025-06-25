
import { useQuery } from '@tanstack/react-query';
import { Classified, ClassifiedFilters } from '@/types/classifieds';

// Mock data for now - replace with actual API call
const mockClassifieds: Classified[] = [
  {
    id: '1',
    title: 'MacBook Pro 2023 - Excellent Condition',
    description: 'Barely used MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Perfect for students or professionals.',
    category: 'Electronics',
    zipCode: '94102',
    email: 'seller1@email.com',
    phone: '(555) 123-4567',
    images: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500'],
    pricingTier: 'standard',
    contactObfuscated: false,
    createdAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '2',
    title: '2020 Honda Civic - Low Miles',
    description: 'Well maintained Honda Civic with only 25k miles. Clean title, no accidents, excellent gas mileage.',
    category: 'Vehicles',
    zipCode: '94103',
    email: 'carseller@email.com',
    phone: '(555) 987-6543',
    images: [],
    pricingTier: 'basic',
    contactObfuscated: false,
    createdAt: '2024-01-14T15:30:00Z',
    expiresAt: '2024-02-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Professional Web Development Services',
    description: 'Full-stack developer offering custom website development, e-commerce solutions, and maintenance services.',
    category: 'Services',
    zipCode: '94104',
    email: 'webdev@email.com',
    phone: '(555) 456-7890',
    images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500'],
    pricingTier: 'premium',
    contactObfuscated: true,
    createdAt: '2024-01-13T09:15:00Z',
    expiresAt: '2024-02-13T09:15:00Z'
  }
];

const fetchClassifieds = async (filters: ClassifiedFilters): Promise<Classified[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = mockClassifieds;

  if (filters.category) {
    filtered = filtered.filter(c => c.category === filters.category);
  }

  if (filters.zipCode) {
    filtered = filtered.filter(c => c.zipCode.includes(filters.zipCode!));
  }

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(keyword) ||
      c.description.toLowerCase().includes(keyword)
    );
  }

  return filtered;
};

export const useClassifieds = (filters: ClassifiedFilters) => {
  return useQuery({
    queryKey: ['classifieds', filters],
    queryFn: () => fetchClassifieds(filters),
    staleTime: 5 * 60 * 1000,
  });
};
