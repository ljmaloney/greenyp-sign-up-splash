
import { getApiUrl } from '@/config/api';
import { CategoryWithIcon } from '@/types/category';

// Mock data as fallback for development/CORS issues
const MOCK_CATEGORIES: CategoryWithIcon[] = [
  {
    lineOfBusinessId: 'automotive',
    lineOfBusinessName: 'Automotive',
    shortDescription: 'Auto services and repairs',
    description: 'Automotive services including repairs, maintenance, and sales',
    iconName: 'car',
    iconComponent: null as any,
    slug: 'automotive',
    iconFileName: null,
    createDate: new Date().toISOString(),
    lastUpdateDate: new Date().toISOString(),
    createType: 'SYSTEM',
    createByReference: 'SYSTEM'
  },
  {
    lineOfBusinessId: 'restaurants',
    lineOfBusinessName: 'Restaurants & Food',
    shortDescription: 'Dining and food services',
    description: 'Restaurants, cafes, and food service businesses',
    iconName: 'utensils',
    iconComponent: null as any,
    slug: 'restaurants',
    iconFileName: null,
    createDate: new Date().toISOString(),
    lastUpdateDate: new Date().toISOString(),
    createType: 'SYSTEM',
    createByReference: 'SYSTEM'
  },
  {
    lineOfBusinessId: 'healthcare',
    lineOfBusinessName: 'Healthcare',
    shortDescription: 'Medical and health services',
    description: 'Healthcare providers and medical services',
    iconName: 'heart',
    iconComponent: null as any,
    slug: 'healthcare',
    iconFileName: null,
    createDate: new Date().toISOString(),
    lastUpdateDate: new Date().toISOString(),
    createType: 'SYSTEM',
    createByReference: 'SYSTEM'
  },
  {
    lineOfBusinessId: 'retail',
    lineOfBusinessName: 'Retail & Shopping',
    shortDescription: 'Retail stores and shopping',
    description: 'Retail businesses and shopping establishments',
    iconName: 'shopping-bag',
    iconComponent: null as any,
    slug: 'retail',
    iconFileName: null,
    createDate: new Date().toISOString(),
    lastUpdateDate: new Date().toISOString(),
    createType: 'SYSTEM',
    createByReference: 'SYSTEM'
  }
];

export const fetchCategories = async (): Promise<CategoryWithIcon[]> => {
  console.log('Fetching categories from API...');
  
  try {
    const url = getApiUrl('/reference/lob');
    console.log('🔗 API URL constructed:', {
      baseUrl: 'http://localhost:8081',
      endpoint: '/reference/lob',
      fullUrl: url
    });
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ Categories API returned ${response.status}, using fallback data`);
      return MOCK_CATEGORIES;
    }

    const data = await response.json();
    console.log('✅ Categories API response:', data);

    if (data.errorMessageApi) {
      console.warn('⚠️ Categories API returned error, using fallback data:', data.errorMessageApi);
      return MOCK_CATEGORIES;
    }

    if (!data.response || !Array.isArray(data.response)) {
      console.warn('⚠️ Categories API returned invalid data format, using fallback data');
      return MOCK_CATEGORIES;
    }

    const categories = data.response.map((item: any) => ({
      ...item,
      iconName: item.iconName || 'building',
      iconComponent: null as any,
      slug: item.lineOfBusinessId.toLowerCase().replace(/\s+/g, '-'),
    }));

    console.log('✅ Categories processed successfully:', categories.length, 'items');
    return categories;

  } catch (error) {
    console.error('Error fetching categories:', error);
    console.log('🔄 Using fallback mock data due to fetch error');
    return MOCK_CATEGORIES;
  }
};

export const fetchCategoryServices = async (lineOfBusinessId: string) => {
  console.log('Fetching category services for:', lineOfBusinessId);
  
  try {
    const url = getApiUrl(`/reference/lob/${lineOfBusinessId}/services`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`⚠️ Category services API returned ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    console.log('✅ Category services response:', data);
    
    return data.response || [];
  } catch (error) {
    console.error('Error fetching category services:', error);
    return [];
  }
};
