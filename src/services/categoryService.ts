
import { APICategory, CategoryWithIcon, CategoryService } from '../types/category';
import { APIResponse } from '../types/responseBody';
import * as LucideIcons from 'lucide-react';
import { API_CONFIG, getApiUrl } from '../config/api';

// Fetch categories from the real API with enhanced caching support
export const fetchCategories = async (): Promise<CategoryWithIcon[]> => {
  console.log('🔄 Fetching categories from API...');
  
  try {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES);
    console.log('📡 API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300', // 5 minutes browser cache
      },
    });
    
    if (!response.ok) {
      console.error(`❌ API request failed: ${response.status} ${response.statusText}`);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: APIResponse<APICategory[]> = await response.json();
    console.log('✅ Categories API response received:', {
      hasResponse: !!data.response,
      categoriesCount: Array.isArray(data.response) ? data.response.length : 0,
      hasError: !!data.errorMessageApi
    });
    
    // Access the response data from the generic container
    const categories = data.response;
    
    // Ensure data is an array before processing
    if (!Array.isArray(categories)) {
      console.warn('⚠️ API response data is not an array, falling back to mock data');
      return getMockCategoriesData();
    }
    
    const mappedCategories = mapIconsToCategories(categories);
    console.log('✅ Categories successfully mapped with icons:', mappedCategories.length);
    return mappedCategories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    console.log('🔄 Falling back to mock data');
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
    if (data.errorMessageApi !== null && typeof data.errorMessageApi === 'object' && data.errorMessageApi && 'errorCode' in data.errorMessageApi) {
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
      lineOfBusinessId: "250f0927-f063-4707-b015-3a1a9c549115",
      lineOfBusinessName: "Garden Center",
      shortDescription: "Supplier of plants, tools, fertilizer and gardening equipment",
      description: "A garden center is a retail establishment specializing in the sale of plants, gardening supplies, and related products. These centers offer a wide range of items including flowers, trees, shrubs, seeds, gardening tools, soil amendments, and outdoor decor. Staff provide expert advice on plant care, landscaping, and garden design, catering to both amateur gardeners and professionals. Garden centers often host workshops, demonstrations, and community events to educate and engage customers in gardening pursuits.",
      iconName: "Shrub",
    },
    {
      lineOfBusinessId: "94b68c0d-4124-4a76-83fa-b022c308a42c",
      lineOfBusinessName: "Hardscape Supplier",
      shortDescription: "Supplies gravel, flagstone, and pavers",
      description: "A hardscape supplier specializes in providing materials for non-living, structural elements in landscaping, such as stone, brick, concrete, and wood products. They offer a diverse range of items including pavers, retaining walls, decorative stones, mulch, and landscape edging. Hardscape suppliers cater to contractors, landscapers, and homeowners, offering expert advice on material selection, design options, and installation techniques. Their products enhance outdoor spaces, providing durability, functionality, and aesthetic appeal to landscaping projects.",
      iconName: "Shovel",
    },
    {
      lineOfBusinessId: "05148cc4-a7ee-4415-917c-a478aef8ead5",
      lineOfBusinessName: "Landscape Supplier",
      shortDescription: null,
      description: "A landscape supplier furnishes materials and supplies essential for outdoor projects, ranging from residential gardens to commercial developments. They offer a wide array of items such as plants, trees, soil, mulch, gravel, and decorative rocks. Catering to landscapers, contractors, and homeowners, they provide expertise on plant selection, soil types, and project requirements. Landscape suppliers play a pivotal role in ensuring the success and sustainability of landscaping endeavors by offering quality products and knowledgeable assistance.",
      iconName: "Flower2",
    },
    {
      lineOfBusinessId: "6ea15820-5d6d-49d7-82ab-93c23c37f637",
      lineOfBusinessName: "Landscaper",
      shortDescription: "Professional landscape design and installation",
      description: "Designs, installs, and maintains outdoor spaces, combining elements like plants, trees, flowers, and hardscape features to create harmonious environments. They assess site conditions, consider client preferences, and utilize knowledge of soil, climate, and plant species to craft functional and aesthetically pleasing landscapes. With expertise in horticulture and design principles, they transform yards, parks, and commercial properties into inviting retreats or vibrant showcases. Whether enhancing curb appeal or fostering natural habitats, landscapers balance creativity with practicality to bring outdoor visions to life.",
      iconName: "Tractor",
    },
    {
      lineOfBusinessId: "c891d114-7603-40aa-be8d-e55a23d0d1ff",
      lineOfBusinessName: "Lawn Care",
      shortDescription: "Regular lawn maintaince",
      description: "Lawn care involves maintaining and improving the health and appearance of grassy areas. Services typically include mowing, edging, fertilizing, and weed control. Professionals assess soil conditions, provide proper irrigation, and address issues like pests and diseases to ensure lush, green lawns. Regular maintenance enhances curb appeal, promotes healthy growth, and creates enjoyable outdoor spaces for recreation and relaxation.",
      iconName: "Sprout",
    },
    {
      lineOfBusinessId: "6b3afbf9-e575-419b-8539-e983ecf6c8ab",
      lineOfBusinessName: "Nurseries",
      shortDescription: "Plant nurseries, growing young trees, shrubs, and garden plants",
      description: "A nursery is a specialized facility where plants are propagated, grown, and nurtured for sale. It offers a diverse selection of plants, including trees, shrubs, flowers, and vegetables, often organized by type and size. Nurseries provide expert guidance on plant care, cultivation techniques, and landscaping ideas. They serve both amateur gardeners and professionals, offering healthy, well-cared-for plants and essential gardening supplies. Nurseries contribute to the beautification of landscapes and the enjoyment of gardening enthusiasts.",
      iconName: "Trees",
    },
    {
      lineOfBusinessId: "54286c5f-7181-4166-a07e-21c0a05d57e5",
      lineOfBusinessName: "Pond Maintenance",
      shortDescription: "Installation and maintaince of ponds and water features",
      description: "A pond maintenance business specializes in the care and upkeep of ponds, water features, and aquatic ecosystems. Services typically include cleaning, algae control, water quality testing, filtration system maintenance, and aquatic plant care. Professionals ensure the health and beauty of ponds, promoting balanced ecosystems and optimal water conditions. They may also offer pond design, installation, and repair services, catering to residential, commercial, and institutional clients seeking to enhance their outdoor spaces with tranquil and vibrant water features.",
      iconName: "Droplets",
    }
  ];

  return mapIconsToCategories(mockData);
};

// Mock data for development and fallback (keeping for backward compatibility)
export const mockCategoriesResponse = (): CategoryWithIcon[] => {
  return getMockCategoriesData();
};
