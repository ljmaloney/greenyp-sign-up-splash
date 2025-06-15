
import { getApiUrl } from '@/config/api';

export interface Location {
  locationId: string;
  businessName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber?: string;
  isPrimary?: boolean;
  businessHours?: BusinessHours[];
}

export interface BusinessHours {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

// Check if we're in prototyping mode
const isPrototyping = () => 
  window.location.hostname.includes('lovable') || 
  window.location.hostname === 'localhost';

// Dummy data for prototyping
const getDummyLocations = (): Location[] => [
  {
    locationId: "LOC-001",
    businessName: "Green Valley Organic Farm - Main Farm",
    streetAddress: "1234 Farm Road",
    city: "Greenville",
    state: "California",
    zipCode: "95123",
    country: "USA",
    phoneNumber: "(555) 123-4567",
    isPrimary: true,
    businessHours: [
      { dayOfWeek: "MONDAY", openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: "TUESDAY", openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: "WEDNESDAY", openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: "THURSDAY", openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: "FRIDAY", openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: "SATURDAY", openTime: "09:00", closeTime: "15:00", isClosed: false },
      { dayOfWeek: "SUNDAY", openTime: "00:00", closeTime: "00:00", isClosed: true }
    ]
  },
  {
    locationId: "LOC-002",
    businessName: "Green Valley Organic Farm - Farmers Market Stand",
    streetAddress: "456 Market Square",
    city: "Downtown Greenville",
    state: "California",
    zipCode: "95124",
    country: "USA", 
    phoneNumber: "(555) 123-4567",
    isPrimary: false,
    businessHours: [
      { dayOfWeek: "MONDAY", openTime: "00:00", closeTime: "00:00", isClosed: true },
      { dayOfWeek: "TUESDAY", openTime: "00:00", closeTime: "00:00", isClosed: true },
      { dayOfWeek: "WEDNESDAY", openTime: "00:00", closeTime: "00:00", isClosed: true },
      { dayOfWeek: "THURSDAY", openTime: "00:00", closeTime: "00:00", isClosed: true },
      { dayOfWeek: "FRIDAY", openTime: "00:00", closeTime: "00:00", isClosed: true },
      { dayOfWeek: "SATURDAY", openTime: "07:00", closeTime: "14:00", isClosed: false },
      { dayOfWeek: "SUNDAY", openTime: "08:00", closeTime: "13:00", isClosed: false }
    ]
  },
  {
    locationId: "LOC-003",
    businessName: "Green Valley Organic Farm - Processing Facility",
    streetAddress: "789 Industrial Way",
    city: "Greenville",
    state: "California",
    zipCode: "95125",
    country: "USA",
    phoneNumber: "(555) 123-4568",
    isPrimary: false,
    businessHours: [
      { dayOfWeek: "MONDAY", openTime: "06:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: "TUESDAY", openTime: "06:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: "WEDNESDAY", openTime: "06:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: "THURSDAY", openTime: "06:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: "FRIDAY", openTime: "06:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: "SATURDAY", openTime: "00:00", closeTime: "00:00", isClosed: true },
      { dayOfWeek: "SUNDAY", openTime: "00:00", closeTime: "00:00", isClosed: true }
    ]
  }
];

export const fetchLocations = async (producerId: string): Promise<Location[]> => {
  // Return dummy data in prototyping mode
  if (isPrototyping()) {
    console.log('🔧 Using dummy locations data for prototyping');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 350));
    return getDummyLocations();
  }

  const response = await fetch(getApiUrl(`/producer/${producerId}/locations`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.status}`);
  }
  
  return response.json();
};
