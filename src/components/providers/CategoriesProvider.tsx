
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface CategoriesContextType {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider = ({ children }: CategoriesProviderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const value = {
    categories,
    setCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
