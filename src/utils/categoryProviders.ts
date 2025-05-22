
import { Provider } from '@/components/category/ProviderCard';

// Mock provider data - in a real app, this would come from an API
export const mockProvidersByCategory: Record<string, Provider[]> = {
  "landscaping": [
    { name: "Green Thumb Landscaping", rating: 4.8, reviews: 124, location: "Phoenix, AZ", phone: "(602) 555-1234" },
    { name: "Nature's Design", rating: 4.7, reviews: 98, location: "Scottsdale, AZ", phone: "(480) 555-5678" },
    { name: "Outdoor Creations", rating: 4.9, reviews: 156, location: "Mesa, AZ", phone: "(480) 555-9012" },
    { name: "Pacific Garden Services", rating: 4.6, reviews: 87, location: "Tempe, AZ", phone: "(480) 555-3456" },
    { name: "Professional Yard Solutions", rating: 4.5, reviews: 65, location: "Gilbert, AZ", phone: "(480) 555-7890" },
    { name: "Desert Oasis Landscapes", rating: 4.8, reviews: 112, location: "Chandler, AZ", phone: "(480) 555-4321" }
  ],
  "lawn-care": [
    { name: "Perfect Lawns Inc", rating: 4.9, reviews: 148, location: "Phoenix, AZ", phone: "(602) 555-2345" },
    { name: "Green Grass Experts", rating: 4.7, reviews: 89, location: "Scottsdale, AZ", phone: "(480) 555-6789" },
    { name: "Premier Lawn Services", rating: 4.8, reviews: 116, location: "Mesa, AZ", phone: "(480) 555-0123" },
    { name: "Turf Masters", rating: 4.6, reviews: 75, location: "Tempe, AZ", phone: "(480) 555-4567" },
    { name: "Healthy Lawn Company", rating: 4.7, reviews: 93, location: "Gilbert, AZ", phone: "(480) 555-8901" }
  ],
  "hardscaping": [
    { name: "Stone & Patio Experts", rating: 4.9, reviews: 132, location: "Phoenix, AZ", phone: "(602) 555-3456" },
    { name: "Custom Hardscapes", rating: 4.8, reviews: 108, location: "Scottsdale, AZ", phone: "(480) 555-7890" },
    { name: "Outdoor Living Construction", rating: 4.7, reviews: 94, location: "Mesa, AZ", phone: "(480) 555-1234" },
    { name: "Paver Professionals", rating: 4.8, reviews: 127, location: "Tempe, AZ", phone: "(480) 555-5678" }
  ],
  "nurseries": [
    { name: "Desert Garden Center", rating: 4.8, reviews: 165, location: "Phoenix, AZ", phone: "(602) 555-4567" },
    { name: "Green Valley Nursery", rating: 4.9, reviews: 187, location: "Scottsdale, AZ", phone: "(480) 555-8901" },
    { name: "Sunshine Plants & Trees", rating: 4.7, reviews: 134, location: "Mesa, AZ", phone: "(480) 555-2345" },
    { name: "Native Plants Nursery", rating: 4.8, reviews: 152, location: "Tempe, AZ", phone: "(480) 555-6789" }
  ],
  "plant-suppliers": [
    { name: "Specialty Seeds Co", rating: 4.8, reviews: 118, location: "Phoenix, AZ", phone: "(602) 555-5678" },
    { name: "Rare Plant Emporium", rating: 4.9, reviews: 142, location: "Scottsdale, AZ", phone: "(480) 555-9012" },
    { name: "Organic Garden Supply", rating: 4.7, reviews: 96, location: "Mesa, AZ", phone: "(480) 555-3456" },
    { name: "Desert Adapted Plants", rating: 4.8, reviews: 129, location: "Tempe, AZ", phone: "(480) 555-7890" }
  ],
  "water-features": [
    { name: "Water Garden Experts", rating: 4.9, reviews: 138, location: "Phoenix, AZ", phone: "(602) 555-6789" },
    { name: "Fountain & Pond Co", rating: 4.8, reviews: 105, location: "Scottsdale, AZ", phone: "(480) 555-0123" },
    { name: "Irrigation Specialists", rating: 4.7, reviews: 91, location: "Mesa, AZ", phone: "(480) 555-4567" },
    { name: "Waterfall Designs", rating: 4.8, reviews: 124, location: "Tempe, AZ", phone: "(480) 555-8901" }
  ]
};
