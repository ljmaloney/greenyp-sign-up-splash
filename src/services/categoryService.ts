
import { APICategory, CategoryWithIcon, CategoryService } from '../types/category';
import { APIResponse } from '../types/responseBody';
import * as LucideIcons from 'lucide-react';
import { API_CONFIG, getApiUrl } from '../config/api';

// Fetch categories from the real API
export const fetchCategories = async (): Promise<CategoryWithIcon[]> => {
  try {
    console.log('Fetching categories from API...');
    const url = getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES);
    console.log('API URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: APIResponse<APICategory[]> = await response.json();
    console.log('API response:', data);
    
    // Access the response data from the generic container
    const categories = data.response;
    
    // Ensure data is an array before processing
    if (!Array.isArray(categories)) {
      console.warn('API response data is not an array, falling back to mock data');
      return getMockCategoriesData();
    }
    
    return mapIconsToCategories(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fall back to mock data if the API fails
    return getMockCategoriesData();
  }
};

// Fetch services for a specific category - updated for new API response format
export const fetchCategoryServices = async (lineOfBusinessId: string): Promise<CategoryService[]> => {
  try {
    console.log(`Fetching services for category ${lineOfBusinessId}...`);
    const url = getApiUrl(API_CONFIG.ENDPOINTS.CATEGORY_SERVICES(lineOfBusinessId));
    console.log('Services API URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`API request failed with status ${response.status}, falling back to mock data`);
      return getMockServicesData();
    }
    
    const data: APIResponse<CategoryService[]> = await response.json();
    console.log('Services response:', data);
    
    // Check if there's an error in the API response
    if (data.errorMessageApi !== null && typeof data.errorMessageApi === 'object' && 'errorCode' in data.errorMessageApi) {
      console.warn('API returned error:', data.errorMessageApi);
      return getMockServicesData();
    }
    
    // Access the response data from the generic container
    const services = data.response;
    
    // Ensure data is an array
    if (!Array.isArray(services)) {
      console.warn('Services API response data is not an array, falling back to mock data');
      return getMockServicesData();
    }
    
    return services;
  } catch (error) {
    console.error('Error fetching category services:', error);
    // Return mock data if API fails
    return getMockServicesData();
  }
};

// Get mock services data as fallback
const getMockServicesData = (): CategoryService[] => {
  return [
    {
      lobServiceId: "mock-service-001",
      lineOfBusinessId: "landscaping-001",
      createdByReference: "system",
      createdByType: "ADMIN_USER",
      serviceName: "Landscape Design",
      serviceDescription: "Professional landscape design and planning services for residential and commercial properties"
    },
    {
      lobServiceId: "mock-service-002", 
      lineOfBusinessId: "landscaping-001",
      createdByReference: "system",
      createdByType: "ADMIN_USER",
      serviceName: "Garden Installation",
      serviceDescription: "Complete garden installation including plant selection, soil preparation, and planting"
    },
    {
      lobServiceId: "mock-service-003",
      lineOfBusinessId: "landscaping-001", 
      createdByReference: "system",
      createdByType: "ADMIN_USER",
      serviceName: "Hardscape Construction",
      serviceDescription: "Installation of patios, walkways, retaining walls, and other hardscape elements"
    }
  ];
};

// Maps icon strings from the API to Lucide icon components
export const mapIconsToCategories = (categories: APICategory[]): CategoryWithIcon[] => {
  // Add safety check to ensure categories is an array
  if (!Array.isArray(categories)) {
    console.error('mapIconsToCategories received non-array data:', categories);
    return getMockCategoriesData();
  }

  return categories.map(category => {
    // Get the icon component from lucide-react based on the icon name
    const IconComponent = LucideIcons[category.iconName as keyof typeof LucideIcons] as LucideIcons.LucideIcon || LucideIcons.HelpCircle;
    
    return {
      ...category,
      iconComponent: IconComponent,
      slug: category.lineOfBusinessId // Use the ID as slug for routing
    };
  });
};

// Get mock categories data as a separate function
const getMockCategoriesData = (): CategoryWithIcon[] => {
  const mockData: APICategory[] = [
    {
      lineOfBusinessId: "landscaping-001",
      lineOfBusinessName: "Landscaping",
      shortDescription: "Professional landscape design and installation services",
      description: "Find experts in residential and commercial landscaping, garden design, outdoor living spaces, native plant installations, and sustainable landscape solutions. Landscape professionals can help transform your property with custom designs tailored to your climate and preferences.",
      iconName: "Tractor",
    },
    {
      lineOfBusinessId: "lawn-care-001",
      lineOfBusinessName: "Lawn Care",
      shortDescription: "Regular maintenance, mowing, and lawn treatment specialists",
      description: "Connect with lawn care providers offering services like regular mowing, fertilization, weed control, aeration, overseeding, pest management, and seasonal cleanup. Keep your lawn healthy year-round with professional care and maintenance.",
      iconName: "LeafyGreen",
    },
    {
      lineOfBusinessId: "hardscaping-001",
      lineOfBusinessName: "Hardscaping",
      shortDescription: "Patios, walkways, retaining walls, and outdoor structures",
      description: "Discover professionals who create durable and beautiful hardscape elements including patios, walkways, driveways, retaining walls, fire pits, outdoor kitchens, and decorative stone features that enhance your outdoor living spaces.",
      iconName: "Shovel",
    },
    {
      lineOfBusinessId: "nurseries-001",
      lineOfBusinessName: "Nurseries",
      shortDescription: "Plant nurseries offering trees, shrubs, and garden plants",
      description: "Browse local nurseries with wide selections of trees, shrubs, perennials, annuals, and specialty plants. Many nurseries offer expert advice, garden planning assistance, and delivery options for your plant purchases.",
      iconName: "TreeDeciduous",
    },
    {
      lineOfBusinessId: "plant-suppliers-001",
      lineOfBusinessName: "Plant Suppliers",
      shortDescription: "Seeds, bulbs, and specialty plant retailers",
      description: "Find suppliers specializing in seeds, bulbs, rare plants, native species, organic gardening supplies, and specialty growing media. These businesses often provide educational resources and growing guidance for gardeners of all levels.",
      iconName: "Shrub",
    },
    {
      lineOfBusinessId: "water-features-001",
      lineOfBusinessName: "Pond & Water Features",
      shortDescription: "Installation and maintenance of ponds, fountains, and irrigation",
      description: "Connect with specialists in water feature design, installation, and maintenance including ponds, fountains, waterfalls, irrigation systems, rain gardens, and drainage solutions to enhance your landscape with the beauty of water.",
      iconName: "Droplets",
    },
  ];

  return mapIconsToCategories(mockData);
};

// Mock data for development and fallback (keeping for backward compatibility)
export const mockCategoriesResponse = (): CategoryWithIcon[] => {
  return getMockCategoriesData();
};
