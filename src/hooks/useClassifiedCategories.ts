
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';
import { ClassifiedCategoriesResponse, ClassifiedCategory } from '@/types/classifiedCategories';

// Mock data that matches the API response format
const MOCK_CATEGORIES_DATA: ClassifiedCategoriesResponse = {
  response: [
    {
      categoryId: "093e4dc5-d96a-4c31-becf-a37f26f1b91a",
      active: true,
      name: "Produce",
      urlName: "produce",
      shortDescription: "All kinds of fruits, nuts, roots, and vegetables",
      description: null
    },
    {
      categoryId: "0945061f-d294-4f8b-97fe-63b3a5bf4361",
      active: true,
      name: "Land, Farm, & Garden Services",
      urlName: "services",
      shortDescription: "All types of services for your land and garden",
      description: null
    },
    {
      categoryId: "44d0f776-9ed8-414e-bc5f-b5443bf65977",
      active: true,
      name: "Plants and Trees",
      urlName: "plants-trees",
      shortDescription: "All kinds of plants and trees",
      description: null
    },
    {
      categoryId: "44fa6ffa-848a-43b9-8d8d-a610ca26d0a4",
      active: true,
      name: "Garden Supplies",
      urlName: "gardensupplies",
      shortDescription: "All kinds of garden supplies, fertilizer, etc",
      description: null
    },
    {
      categoryId: "4a383196-ffd8-46eb-b77e-8fce302010e3",
      active: true,
      name: "Hay, Straw, Mulch",
      urlName: "hay-straw",
      shortDescription: "All kinds of hay, wheat straw, pine straw and mulch",
      description: null
    },
    {
      categoryId: "4dcb73ed-10ef-4b39-a332-6b5b3bc48e5b",
      active: true,
      name: "Eggs & Dairy",
      urlName: "eggs-dairy",
      shortDescription: "All kinds of eggs and dairy products",
      description: null
    },
    {
      categoryId: "8185f13e-c3f1-4988-946d-01aae8329f17",
      active: true,
      name: "Lawn & Garden Equipment",
      urlName: "equipment",
      shortDescription: "All kinds of used lawn and garden equipment",
      description: null
    },
    {
      categoryId: "898ac83c-d440-4940-9eec-bafa44786763",
      active: true,
      name: "Livestock",
      urlName: "livestock",
      shortDescription: "All kinds of farm animals",
      description: null
    },
    {
      categoryId: "bb6fa41f-708a-49dd-94cd-b5a1e944ec76",
      active: true,
      name: "Fish and fish supplies",
      urlName: "fish",
      shortDescription: "All kinds of fish and pond supplies",
      description: null
    },
    {
      categoryId: "dac03920-5e9b-40ae-8538-aba5ddad47f4",
      active: true,
      name: "Miscellaneous Farm & Garden",
      urlName: "misc",
      shortDescription: "Everything else",
      description: null
    }
  ],
  errorMessageApi: null
};

export const useClassifiedCategories = () => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['classified-categories'],
    queryFn: async (): Promise<ClassifiedCategoriesResponse> => {
      console.log('🎯 Fetching classified categories from API...');
      try {
        const response = await apiClient.get('/reference/classified/categories');
        console.log('📦 Categories response:', response);
        return response;
      } catch (error) {
        console.log('⚠️ API failed, using mock data for demo purposes:', error);
        return MOCK_CATEGORIES_DATA;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    refetchOnWindowFocus: false,
  });
};
