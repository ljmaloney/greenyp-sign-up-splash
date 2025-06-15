
import { apiRequest, API_CONFIG } from '@/config/api';

export interface Category {
  lobId: string;
  categoryTitle: string;
  categorySlug: string;
  categoryDescription: string;
  serviceCount?: number;
}

// Fallback data for development when API is not accessible
const FALLBACK_CATEGORIES: Category[] = [
  {
    lobId: 'landscaping',
    categoryTitle: 'Landscaping',
    categorySlug: 'landscaping',
    categoryDescription: 'Professional landscaping services including design, installation, and maintenance',
    serviceCount: 15
  },
  {
    lobId: 'lawn-care',
    categoryTitle: 'Lawn Care',
    categorySlug: 'lawn-care',
    categoryDescription: 'Comprehensive lawn care services including mowing, fertilizing, and weed control',
    serviceCount: 12
  },
  {
    lobId: 'garden-centers',
    categoryTitle: 'Garden Centers',
    categorySlug: 'garden-centers',
    categoryDescription: 'Garden centers and nurseries offering plants, tools, and gardening supplies',
    serviceCount: 8
  },
  {
    lobId: 'tree-services',
    categoryTitle: 'Tree Services',
    categorySlug: 'tree-services',
    categoryDescription: 'Tree removal, trimming, and arborist services',
    serviceCount: 10
  }
];

export const fetchCategories = async (): Promise<Category[]> => {
  console.log('Fetching categories from API...');
  console.log('API URL:', `${API_CONFIG.baseUrl}/reference/lob`);
  
  try {
    const data = await apiRequest('/reference/lob');
    
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data:', data);
      throw new Error('Invalid data format from API');
    }
    
    return data;
    
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

export const fetchCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const categories = await fetchCategories();
    return categories.find(cat => cat.categorySlug === slug) || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    
    // Fallback for development
    if (API_CONFIG.isDevelopment) {
      return FALLBACK_CATEGORIES.find(cat => cat.categorySlug === slug) || null;
    }
    
    throw error;
  }
};
