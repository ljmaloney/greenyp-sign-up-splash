
import { getApiUrl } from '@/config/api';

export interface Location {
  locationId: string;
  locationName: string;
  locationType: string;
  locationDisplayType: string;
  active: boolean;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  websiteUrl?: string;
  businessName?: string;
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
    locationName: "Green Valley Organic Farm - Main Farm",
    locationType: "HOME_OFFICE_PRIMARY",
    locationDisplayType: "FULL_ADDRESS",
    active: true,
    addressLine1: "1234 Farm Road",
    addressLine2: "",
    addressLine3: "",
    city: "Greenville",
    state: "California",
    postalCode: "95123",
    latitude: 37.7749,
    longitude: -122.4194,
    websiteUrl: "https://greenvalleyorganic.com",
    businessName: "Green Valley Organic Farm - Main Farm",
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
    locationName: "Green Valley Organic Farm - Farmers Market Stand",
    locationType: "RETAIL_SALES_SERVICE",
    locationDisplayType: "CITY_STATE_ZIP",
    active: true,
    addressLine1: "456 Market Square",
    addressLine2: "",
    addressLine3: "",
    city: "Downtown Greenville",
    state: "California",
    postalCode: "95124",
    latitude: 37.7849,
    longitude: -122.4294,
    websiteUrl: "",
    businessName: "Green Valley Organic Farm - Farmers Market Stand",
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
    locationName: "Green Valley Organic Farm - Processing Facility",
    locationType: "WHOLESALE_SALES",
    locationDisplayType: "NO_DISPLAY",
    active: false,
    addressLine1: "789 Industrial Way",
    addressLine2: "",
    addressLine3: "",
    city: "Greenville",
    state: "California",
    postalCode: "95125",
    latitude: 37.7649,
    longitude: -122.4094,
    websiteUrl: "",
    businessName: "Green Valley Organic Farm - Processing Facility",
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
