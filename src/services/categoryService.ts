
import { Category, CategoryWithIcon } from '../types/category';
import * as LucideIcons from 'lucide-react';

// This function fetches categories from the API
export const fetchCategories = async (): Promise<CategoryWithIcon[]> => {
  try {
    // In a real app, this would be an environment variable or configuration
    const apiUrl = 'https://api.example.com/categories';
    
    // For demo purposes, we're using a mock response instead of a real API call
    // Remove this and uncomment the fetch code below in a real application
    return mockCategoriesResponse();
    
    // Real implementation would be:
    // const response = await fetch(apiUrl);
    // if (!response.ok) {
    //   throw new Error(`API request failed with status ${response.status}`);
    // }
    // const data: Category[] = await response.json();
    // return mapIconsToCategories(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fall back to mock data if the API fails
    return mockCategoriesResponse();
  }
};

// Maps icon strings from the API to Lucide icon components
export const mapIconsToCategories = (categories: Category[]): CategoryWithIcon[] => {
  return categories.map(category => {
    // Get the icon component from lucide-react based on the icon name
    const IconComponent = LucideIcons[category.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon || LucideIcons.HelpCircle;
    
    return {
      ...category,
      iconComponent: IconComponent
    };
  });
};

// Mock data for development and fallback
export const mockCategoriesResponse = (): CategoryWithIcon[] => {
  const mockData: Category[] = [
    {
      title: "Landscaping",
      description: "Professional landscape design and installation services",
      icon: "Tractor",
      details: "Find experts in residential and commercial landscaping, garden design, outdoor living spaces, native plant installations, and sustainable landscape solutions. Landscape professionals can help transform your property with custom designs tailored to your climate and preferences.",
      slug: "landscaping",
    },
    {
      title: "Lawn Care",
      description: "Regular maintenance, mowing, and lawn treatment specialists",
      icon: "LeafyGreen",
      details: "Connect with lawn care providers offering services like regular mowing, fertilization, weed control, aeration, overseeding, pest management, and seasonal cleanup. Keep your lawn healthy year-round with professional care and maintenance.",
      slug: "lawn-care",
    },
    {
      title: "Hardscaping",
      description: "Patios, walkways, retaining walls, and outdoor structures",
      icon: "Shovel",
      details: "Discover professionals who create durable and beautiful hardscape elements including patios, walkways, driveways, retaining walls, fire pits, outdoor kitchens, and decorative stone features that enhance your outdoor living spaces.",
      slug: "hardscaping",
    },
    {
      title: "Nurseries",
      description: "Plant nurseries offering trees, shrubs, and garden plants",
      icon: "TreeDeciduous",
      details: "Browse local nurseries with wide selections of trees, shrubs, perennials, annuals, and specialty plants. Many nurseries offer expert advice, garden planning assistance, and delivery options for your plant purchases.",
      slug: "nurseries",
    },
    {
      title: "Plant Suppliers",
      description: "Seeds, bulbs, and specialty plant retailers",
      icon: "Shrub",
      details: "Find suppliers specializing in seeds, bulbs, rare plants, native species, organic gardening supplies, and specialty growing media. These businesses often provide educational resources and growing guidance for gardeners of all levels.",
      slug: "plant-suppliers",
    },
    {
      title: "Pond & Water Features",
      description: "Installation and maintenance of ponds, fountains, and irrigation",
      icon: "Droplets",
      details: "Connect with specialists in water feature design, installation, and maintenance including ponds, fountains, waterfalls, irrigation systems, rain gardens, and drainage solutions to enhance your landscape with the beauty of water.",
      slug: "water-features",
    },
  ];

  return mapIconsToCategories(mockData);
};
