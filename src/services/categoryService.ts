
import { apiRequest, API_CONFIG } from '@/config/api';
import { CategoryWithIcon } from '@/types/category';
import { Leaf, TreePine, Scissors, Flower } from 'lucide-react';

export interface Category {
  lobId: string;
  categoryTitle: string;
  categorySlug: string;
  categoryDescription: string;
  serviceCount?: number;
}

export interface CategoryService {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
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
    lobId: 'landscaping',
    categoryTitle: 'Landscaping',
    categorySlug: 'landscaping',
    categoryDescription: 'Professional landscaping services including design, installation, and maintenance',
    serviceCount: 15,
    lineOfBusinessId: 'landscaping',
    lineOfBusinessName: 'Landscaping',
    shortDescription: 'Professional landscaping services including design, installation, and maintenance',
    slug: 'landscaping',
    iconComponent: Leaf
  },
  {
    lobId: 'lawn-care',
    categoryTitle: 'Lawn Care',
    categorySlug: 'lawn-care',
    categoryDescription: 'Comprehensive lawn care services including mowing, fertilizing, and weed control',
    serviceCount: 12,
    lineOfBusinessId: 'lawn-care',
    lineOfBusinessName: 'Lawn Care',
    shortDescription: 'Comprehensive lawn care services including mowing, fertilizing, and weed control',
    slug: 'lawn-care',
    iconComponent: Scissors
  },
  {
    lobId: 'garden-centers',
    categoryTitle: 'Garden Centers',
    categorySlug: 'garden-centers',
    categoryDescription: 'Garden centers and nurseries offering plants, tools, and gardening supplies',
    serviceCount: 8,
    lineOfBusinessId: 'garden-centers',
    lineOfBusinessName: 'Garden Centers',
    shortDescription: 'Garden centers and nurseries offering plants, tools, and gardening supplies',
    slug: 'garden-centers',
    iconComponent: Flower
  },
  {
    lobId: 'tree-services',
    categoryTitle: 'Tree Services',
    categorySlug: 'tree-services',
    categoryDescription: 'Tree removal, trimming, and arborist services',
    serviceCount: 10,
    lineOfBusinessId: 'tree-services',
    lineOfBusinessName: 'Tree Services',
    shortDescription: 'Tree removal, trimming, and arborist services',
    slug: 'tree-services',
    iconComponent: TreePine
  }
];

const FALLBACK_CATEGORY_SERVICES: CategoryService[] = [
  {
    serviceId: 'service-001',
    serviceName: 'Landscape Design',
    serviceDescription: 'Custom landscape design services'
  },
  {
    serviceId: 'service-002',
    serviceName: 'Garden Installation',
    serviceDescription: 'Professional garden installation'
  },
  {
    serviceId: 'service-003',
    serviceName: 'Lawn Maintenance',
    serviceDescription: 'Regular lawn care and maintenance'
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
      lobId: category.lobId || category.lineOfBusinessId,
      categoryTitle: category.categoryTitle || category.lineOfBusinessName,
      categorySlug: category.categorySlug || category.slug,
      categoryDescription: category.categoryDescription || category.shortDescription,
      serviceCount: category.serviceCount,
      lineOfBusinessId: category.lineOfBusinessId || category.lobId,
      lineOfBusinessName: category.lineOfBusinessName || category.categoryTitle,
      shortDescription: category.shortDescription || category.categoryDescription,
      slug: category.slug || category.categorySlug,
      iconComponent: CATEGORY_ICONS[category.categorySlug || category.slug] || Leaf
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
    return categories.find(cat => cat.categorySlug === slug || cat.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    
    // Fallback for development
    if (API_CONFIG.isDevelopment) {
      return FALLBACK_CATEGORIES.find(cat => cat.categorySlug === slug || cat.slug === slug) || null;
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
    
    return data;
    
  } catch (error) {
    console.error('Error fetching category services:', error);
    
    // In development mode, provide fallback data
    if (API_CONFIG.isDevelopment) {
      console.log('🔧 Using fallback category services for development mode');
      return FALLBACK_CATEGORY_SERVICES;
    }
    
    // In production, re-throw the error
    throw new Error(`Failed to fetch category services: ${error.message}`);
  }
};
