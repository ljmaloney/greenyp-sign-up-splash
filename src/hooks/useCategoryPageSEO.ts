
import { useEffect } from 'react';
import { CategoryWithIcon } from '@/types/category';

export const useCategoryPageSEO = (category: CategoryWithIcon | undefined) => {
  useEffect(() => {
    // Update document title for SEO
    if (category) {
      document.title = `${category.title} - GreenYP`;
      
      // Create meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      const metaDesc = `Connect with top-rated ${category.title.toLowerCase()} professionals. Browse reviews, see portfolios, and request quotes.`;
      
      if (metaDescription) {
        metaDescription.setAttribute('content', metaDesc);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = metaDesc;
        document.head.appendChild(meta);
      }
    }
  }, [category]);
};
