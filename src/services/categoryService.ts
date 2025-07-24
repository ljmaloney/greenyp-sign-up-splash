
import { getApiUrl } from '@/config/api';
import { CategoryWithIcon } from '@/types/category';

// Mock data as fallback for development/CORS issues
const MOCK_CATEGORIES: CategoryWithIcon[] = [
  {
    lineOfBusinessId: 'automotive',
    lineOfBusinessName: 'Automotive',
    shortDescription: 'Auto services and repairs',
    description: 'Automotive services including repairs, maintenance, and sales',
    enableDistanceRadius: true,
    iconName: 'car',
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
    enableDistanceRadius: true,
    iconName: 'utensils',
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
    enableDistanceRadius: true,
    iconName: 'heart',
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
    enableDistanceRadius: true,
    iconName: 'shopping-bag',
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
    }));

    console.log('✅ Categories processed successfully:', categories.length, 'items');
    return categories;

  } catch (error) {
    console.error('Error fetching categories:', error);
    console.log('🔄 Using fallback mock data due to fetch error');
    return MOCK_CATEGORIES;
  }
};
