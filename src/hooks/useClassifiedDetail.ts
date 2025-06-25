
import { useQuery } from '@tanstack/react-query';
import { Classified } from '@/types/classifieds';

// Mock data - in a real app, this would be an API call
const mockClassifieds: Classified[] = [
  {
    id: '1',
    title: 'John Deere Riding Mower - Excellent Condition',
    description: 'Well-maintained John Deere riding mower, perfect for large lawns. Low hours, new blades, runs great.\n\nThis mower has been garage-kept and regularly serviced. It features a 42-inch cutting deck, automatic transmission, and comfortable seating. Perfect for homeowners with large properties or landscaping professionals.\n\nIncludes:\n- Original owner\'s manual\n- Maintenance records\n- Extra set of blades\n- Grass catcher attachment\n\nSerious inquiries only. Cash preferred.',
    category: 'Lawn & Garden Equipment',
    zipCode: '30309',
    email: 'seller1@email.com',
    phone: '(404) 555-4567',
    images: [
      'https://images.unsplash.com/photo-1558618666-9c5e22e6203c?w=500',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'
    ],
    pricingTier: 'standard',
    contactObfuscated: false,
    createdAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Fresh Organic Tomatoes - Farm Direct',
    description: 'Vine-ripened organic tomatoes, picked fresh this morning. Various varieties available including Cherokee Purple, Brandywine, and Roma tomatoes.\n\nAll tomatoes are grown using organic farming methods without pesticides or chemical fertilizers. Perfect for restaurants, farmers markets, or families who appreciate quality produce.\n\nAvailable varieties:\n- Cherokee Purple (heirloom)\n- Brandywine (heirloom)\n- Roma (paste tomato)\n- Cherry tomatoes\n\nPricing:\n- $4/lb for heirloom varieties\n- $3/lb for Roma\n- $5/lb for cherry tomatoes\n\nBulk discounts available for orders over 25 lbs.',
    category: 'Fruits, Vegetables',
    zipCode: '30305',
    email: 'farmer@email.com',
    phone: '(404) 987-6543',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500',
      'https://images.unsplash.com/photo-1416431168657-a6c4f5c24e33?w=500'
    ],
    pricingTier: 'basic',
    contactObfuscated: false,
    createdAt: '2024-01-14T15:30:00Z',
    expiresAt: '2024-02-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Professional Landscaping Services',
    description: 'Full-service landscaping company offering design, installation, and maintenance services for residential and commercial properties.\n\nOur experienced team provides:\n- Landscape design and consultation\n- Hardscape installation (patios, walkways, retaining walls)\n- Irrigation system installation and repair\n- Regular maintenance and lawn care\n- Tree and shrub planting\n- Seasonal cleanup services\n\nWe\'ve been serving the Atlanta area for over 15 years with hundreds of satisfied customers. Licensed, bonded, and insured.\n\nFree estimates available. Contact us to discuss your landscaping needs and transform your outdoor space.',
    category: 'Landscaping Services',
    zipCode: '30308',
    email: 'landscape@email.com',
    phone: '(404) 456-7890',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
      'https://images.unsplash.com/photo-1416431168657-a6c4f5c24e33?w=500',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
      'https://images.unsplash.com/photo-1558618666-9c5e22e6203c?w=500'
    ],
    pricingTier: 'premium',
    contactObfuscated: true,
    createdAt: '2024-01-13T09:15:00Z',
    expiresAt: '2024-02-13T09:15:00Z'
  }
];

const fetchClassifiedDetail = async (id: string): Promise<Classified | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const classified = mockClassifieds.find(c => c.id === id);
  return classified || null;
};

export const useClassifiedDetail = (id: string) => {
  return useQuery({
    queryKey: ['classifiedDetail', id],
    queryFn: () => fetchClassifiedDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
