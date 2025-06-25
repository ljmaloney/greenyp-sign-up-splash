
import { useInfiniteQuery } from '@tanstack/react-query';
import { Classified, ClassifiedFilters } from '@/types/classifieds';

// Mock data for now - replace with actual API call
const mockClassifieds: Classified[] = [
  {
    id: '1',
    title: 'John Deere Riding Mower - Excellent Condition',
    description: 'Well-maintained John Deere riding mower, perfect for large lawns. Low hours, new blades, runs great.',
    category: 'Lawn & Garden Equipment',
    zipCode: '30309',
    email: 'seller1@email.com',
    phone: '(404) 555-4567',
    images: ['https://images.unsplash.com/photo-1558618666-9c5e22e6203c?w=500'],
    pricingTier: 'standard',
    contactObfuscated: false,
    createdAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Fresh Organic Tomatoes - Farm Direct',
    description: 'Vine-ripened organic tomatoes, picked fresh this morning. Various varieties available.',
    category: 'Fruits, Vegetables',
    zipCode: '30305',
    email: 'farmer@email.com',
    phone: '(404) 987-6543',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'],
    pricingTier: 'basic',
    contactObfuscated: false,
    createdAt: '2024-01-14T15:30:00Z',
    expiresAt: '2024-02-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Professional Landscaping Services',
    description: 'Full-service landscaping company offering design, installation, and maintenance services.',
    category: 'Landscaping Services',
    zipCode: '30308',
    email: 'landscape@email.com',
    phone: '(404) 456-7890',
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'],
    pricingTier: 'premium',
    contactObfuscated: true,
    createdAt: '2024-01-13T09:15:00Z',
    expiresAt: '2024-02-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Holstein Dairy Cows for Sale',
    description: 'Healthy Holstein dairy cows, excellent milk production. Health certificates available.',
    category: 'Livestock',
    zipCode: '30312',
    email: 'ranch@email.com',
    phone: '(770) 555-0123',
    images: [],
    pricingTier: 'standard',
    contactObfuscated: false,
    createdAt: '2024-01-12T14:20:00Z',
    expiresAt: '2024-02-12T14:20:00Z'
  },
  {
    id: '5',
    title: 'Bulk Mulch and Compost',
    description: 'High-quality organic mulch and compost, delivered in bulk. Great for gardens and landscaping.',
    category: 'Garden Supplies',
    zipCode: '30307',
    email: 'supplies@email.com',
    phone: '(678) 555-0456',
    images: ['https://images.unsplash.com/photo-1416431168657-a6c4f5c24e33?w=500'],
    pricingTier: 'basic',
    contactObfuscated: false,
    createdAt: '2024-01-11T11:45:00Z',
    expiresAt: '2024-02-11T11:45:00Z'
  },
  {
    id: '6',
    title: 'Chainsaw Husqvarna 455 Rancher',
    description: 'Professional-grade chainsaw, barely used. Includes extra chains and carrying case.',
    category: 'Lawn & Garden Equipment',
    zipCode: '30309',
    email: 'tools@email.com',
    phone: '(404) 555-0789',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500'],
    pricingTier: 'standard',
    contactObfuscated: false,
    createdAt: '2024-01-10T16:30:00Z',
    expiresAt: '2024-02-10T16:30:00Z'
  },
  {
    id: '7',
    title: 'Apple Orchard Picking Services',
    description: 'Help wanted for apple picking season. Flexible hours, competitive pay.',
    category: 'Jobs',
    zipCode: '30305',
    email: 'orchard@email.com',
    phone: '(770) 555-0234',
    images: [],
    pricingTier: 'basic',
    contactObfuscated: false,
    createdAt: '2024-01-09T08:00:00Z',
    expiresAt: '2024-02-09T08:00:00Z'
  },
  {
    id: '8',
    title: 'Greenhouse Kit - 10x12 ft',
    description: 'Brand new greenhouse kit, never assembled. All parts included with instructions.',
    category: 'Garden Supplies',
    zipCode: '30308',
    email: 'greenhouse@email.com',
    phone: '(678) 555-0567',
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'],
    pricingTier: 'premium',
    contactObfuscated: true,
    createdAt: '2024-01-08T13:15:00Z',
    expiresAt: '2024-02-08T13:15:00Z'
  }
];

interface PaginatedResponse {
  data: Classified[];
  hasNextPage: boolean;
  nextCursor?: number;
}

// Simple function to calculate mock distance based on zip codes
const calculateDistance = (zip1: string, zip2: string): number => {
  // Mock distance calculation - in real app this would use geolocation
  const num1 = parseInt(zip1);
  const num2 = parseInt(zip2);
  const diff = Math.abs(num1 - num2);
  return Math.min(Math.max(diff / 100, 1), 150); // Mock distance between 1-150 miles
};

const fetchClassifieds = async (
  filters: ClassifiedFilters,
  pageParam: number = 0
): Promise<PaginatedResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filtered = [...mockClassifieds];

  if (filters.category) {
    filtered = filtered.filter(c => c.category === filters.category);
  }

  if (filters.zipCode) {
    filtered = filtered.filter(c => c.zipCode.includes(filters.zipCode!));
    
    // Calculate distances and add to each classified for sorting
    const classifiedsWithDistance = filtered.map(c => ({
      ...c,
      distance: calculateDistance(filters.zipCode!, c.zipCode)
    }));

    // Filter by max miles if specified
    if (filters.maxMiles) {
      filtered = classifiedsWithDistance.filter(c => c.distance <= filters.maxMiles!);
    } else {
      filtered = classifiedsWithDistance;
    }

    // Sort by distance (nearest first)
    filtered.sort((a, b) => a.distance - b.distance);
  }

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(keyword) ||
      c.description.toLowerCase().includes(keyword)
    );
  }

  // If no zipCode filter, sort by creation date (newest first) as fallback
  if (!filters.zipCode) {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Simulate pagination
  const pageSize = 6;
  const start = pageParam * pageSize;
  const end = start + pageSize;
  const paginatedData = filtered.slice(start, end);
  
  // Create additional mock data for pagination demo
  const additionalMockData = Array.from({ length: pageSize }, (_, index) => ({
    ...mockClassifieds[index % mockClassifieds.length],
    id: `${mockClassifieds[index % mockClassifieds.length].id}-page-${pageParam}-${index}`,
    title: `${mockClassifieds[index % mockClassifieds.length].title} (Page ${pageParam + 1})`,
  }));

  const finalData = pageParam === 0 ? paginatedData : additionalMockData;

  return {
    data: finalData,
    hasNextPage: pageParam < 3, // Simulate 4 pages max
    nextCursor: pageParam + 1,
  };
};

export const useInfiniteClassifieds = (filters: ClassifiedFilters) => {
  return useInfiniteQuery({
    queryKey: ['infiniteClassifieds', filters],
    queryFn: ({ pageParam = 0 }) => fetchClassifieds(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};
