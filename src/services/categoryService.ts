
import { apiRequest, API_CONFIG } from '@/config/api';
import { CategoryWithIcon, CategoryService } from '@/types/category';
import { Leaf, TreePine, Scissors, Flower } from 'lucide-react';

// Legacy interface for backward compatibility
export interface Category {
  lobId: string;
  categoryTitle: string;
  categorySlug: string;
  categoryDescription: string;
  serviceCount?: number;
}

// Icon mapping for categories
const CATEGORY_ICONS = {
  'landscaping': Leaf,
  'lawn-care': Scissors,
  'garden-centers': Flower,
  'tree-services': TreePine,
};

// Fallback data for development when API is not accessible
const FALLBACK_CATEGORIES: CategoryWithIcon[] = [
  {
    lineOfBusinessId: 'landscaping',
    lineOfBusinessName: 'Landscaping',
    shortDescription: 'Professional landscaping services including design, installation, and maintenance',
    iconName: 'landscaping',
    slug: 'landscaping',
    iconComponent: Leaf,
    serviceCount: 15,
    // Legacy compatibility
    lobId: 'landscaping',
    categoryTitle: 'Landscaping',
    categorySlug: 'landscaping',
    categoryDescription: 'Professional landscaping services including design, installation, and maintenance'
  },
  {
    lineOfBusinessId: 'lawn-care',
    lineOfBusinessName: 'Lawn Care',
    shortDescription: 'Comprehensive lawn care services including mowing, fertilizing, and weed control',
    iconName: 'lawn-care',
    slug: 'lawn-care',
    iconComponent: Scissors,
    serviceCount: 12,
    // Legacy compatibility
    lobId: 'lawn-care',
    categoryTitle: 'Lawn Care',
    categorySlug: 'lawn-care',
    categoryDescription: 'Comprehensive lawn care services including mowing, fertilizing, and weed control'
  },
  {
    lineOfBusinessId: 'garden-centers',
    lineOfBusinessName: 'Garden Centers',
    shortDescription: 'Garden centers and nurseries offering plants, tools, and gardening supplies',
    iconName: 'garden-centers',
    slug: 'garden-centers',
    iconComponent: Flower,
    serviceCount: 8,
    // Legacy compatibility
    lobId: 'garden-centers',
    categoryTitle: 'Garden Centers',
    categorySlug: 'garden-centers',
    categoryDescription: 'Garden centers and nurseries offering plants, tools, and gardening supplies'
  },
  {
    lineOfBusinessId: 'tree-services',
    lineOfBusinessName: 'Tree Services',
    shortDescription: 'Tree removal, trimming, and arborist services',
    iconName: 'tree-services',
    slug: 'tree-services',
    iconComponent: TreePine,
    serviceCount: 10,
    // Legacy compatibility
    lobId: 'tree-services',
    categoryTitle: 'Tree Services',
    categorySlug: 'tree-services',
    categoryDescription: 'Tree removal, trimming, and arborist services'
  }
];

const FALLBACK_CATEGORY_SERVICES: CategoryService[] = [
  {
    lobServiceId: 'service-001',
    lineOfBusinessId: 'landscaping',
    createdByReference: 'system',
    createdByType: 'SYSTEM',
    serviceName: 'Landscape Design',
    serviceDescription: 'Custom landscape design services',
    // Legacy compatibility
    serviceId: 'service-001'
  },
  {
    lobServiceId: 'service-002',
    lineOfBusinessId: 'landscaping',
    createdByReference: 'system',
    createdByType: 'SYSTEM',
    serviceName: 'Garden Installation',
    serviceDescription: 'Professional garden installation',
    // Legacy compatibility
    serviceId: 'service-002'
  },
  {
    lobServiceId: 'service-003',
    lineOfBusinessId: 'lawn-care',
    createdByReference: 'system',
    createdByType: 'SYSTEM',
    serviceName: 'Lawn Maintenance',
    serviceDescription: 'Regular lawn care and maintenance',
    // Legacy compatibility
    serviceId: 'service-003'
  }
];

export const fetchCategories = async (): Promise<CategoryWithIcon[]> => {
  console.log('Fetching categories from API...');
  console.log('API URL:', `${API_CONFIG.baseUrl}/reference/lob`);
  
  try {
    const data = await apiRequest('/reference/lob');
    
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data:', data);
      throw new Error('Invalid data format from API');
    }
    
    // Convert API data to CategoryWithIcon format
    const categoriesWithIcons: CategoryWithIcon[] = data.map((category: any) => ({
      lineOfBusinessId: category.lineOfBusinessId || category.lobId,
      lineOfBusinessName: category.lineOfBusinessName || category.categoryTitle,
      shortDescription: category.shortDescription || category.categoryDescription,
      iconName: category.iconName || category.categorySlug || category.slug,
      slug: category.slug || category.categorySlug || category.lineOfBusinessId,
      iconComponent: CATEGORY_ICONS[category.categorySlug || category.slug || category.lineOfBusinessId] || Leaf,
      serviceCount: category.serviceCount,
      // Legacy compatibility
      lobId: category.lobId || category.lineOfBusinessId,
      categoryTitle: category.categoryTitle || category.lineOfBusinessName,
      categorySlug: category.categorySlug || category.slug,
      categoryDescription: category.categoryDescription || category.shortDescription
    }));
    
    return categoriesWithIcons;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // In development mode, provide fallback data
    if (API_CONFIG.isDevelopment) {
      console.log('🔧 Using fallback categories for development mode');
      return FALLBACK_CATEGORIES;
    }
    
    // In production, re-throw the error
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

export const fetchCategoryBySlug = async (slug: string): Promise<CategoryWithIcon | null> => {
  try {
    const categories = await fetchCategories();
    return categories.find(cat => 
      cat.slug === slug || 
      cat.lineOfBusinessId === slug ||
      cat.categorySlug === slug
    ) || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    
    // Fallback for development
    if (API_CONFIG.isDevelopment) {
      return FALLBACK_CATEGORIES.find(cat => 
        cat.slug === slug || 
        cat.lineOfBusinessId === slug ||
        cat.categorySlug === slug
      ) || null;
    }
    
    throw error;
  }
};

export const fetchCategoryServices = async (lineOfBusinessId: string): Promise<CategoryService[]> => {
  console.log('Fetching category services for:', lineOfBusinessId);
  
  try {
    const data = await apiRequest(`/reference/lob/${lineOfBusinessId}/services`);
    
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data for category services:', data);
      throw new Error('Invalid data format from API');
    }
    
    // Convert API data to ensure it matches our interface
    const services: CategoryService[] = data.map((service: any) => ({
      lobServiceId: service.lobServiceId || service.serviceId,
      lineOfBusinessId: service.lineOfBusinessId || lineOfBusinessId,
      createdByReference: service.createdByReference || 'api',
      createdByType: service.createdByType || 'API',
      serviceName: service.serviceName,
      serviceDescription: service.serviceDescription,
      // Legacy compatibility
      serviceId: service.serviceId || service.lobServiceId
    }));
    
    return services;
    
  } catch (error) {
    console.error('Error fetching category services:', error);
    
    // In development mode, provide fallback data
    if (API_CONFIG.isDevelopment) {
      console.log('🔧 Using fallback category services for development mode');
      return FALLBACK_CATEGORY_SERVICES.filter(service => 
        service.lineOfBusinessId === lineOfBusinessId
      );
    }
    
    // In production, re-throw the error
    throw new Error(`Failed to fetch category services: ${error.message}`);
  }
};
