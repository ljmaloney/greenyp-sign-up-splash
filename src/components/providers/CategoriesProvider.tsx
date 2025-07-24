
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchCategories } from '@/services/categoryService';
import { CategoryWithIcon } from '@/types/category';

interface CategoriesContextType {
  categories: CategoryWithIcon[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

interface CategoriesProviderProps {
  children: React.ReactNode;
  prefetchOnMount?: boolean;
}

export const CategoriesProvider = ({ children, prefetchOnMount = false }: CategoriesProviderProps) => {
  const [categories, setCategories] = useState<CategoryWithIcon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (prefetchOnMount) {
      console.log('🚀 CategoriesProvider: Prefetching categories on mount');
      handleFetch();
    }
  }, [prefetchOnMount]);

  const handleFetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 CategoriesProvider: Starting fetch');
      
      const result = await fetchCategories();
      setCategories(result);
      console.log('✅ CategoriesProvider: Fetch successful');
    } catch (err) {
      console.error('❌ CategoriesProvider: Fetch failed:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    console.log('🔄 CategoriesProvider: Manual refetch requested');
    handleFetch();
  };

  const value: CategoriesContextType = {
    categories,
    isLoading,
    error,
    refetch
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
