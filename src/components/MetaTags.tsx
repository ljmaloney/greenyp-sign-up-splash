import { useEffect } from 'react';

const MetaTags = () => {
  useEffect(() => {
    // Environment-specific meta tag values
    const ogTitle = import.meta.env.VITE_OG_TITLE || 'GreenYP - The Green Industry Business Directory';
    const ogDescription = import.meta.env.VITE_OG_DESCRIPTION || 'Find and list green industry businesses. Landscaping, lawn care, nurseries, and more.';
    const ogImage = import.meta.env.VITE_OG_IMAGE || 'https://lovable.dev/opengraph-image-p98pqg.png';
    const twitterSite = import.meta.env.VITE_TWITTER_SITE || '@GreenYP';
    const ogUrl = import.meta.env.VITE_OG_URL || window.location.origin;

    // Update Open Graph meta tags
    updateMetaTag('property', 'og:title', ogTitle);
    updateMetaTag('property', 'og:description', ogDescription);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:url', ogUrl);
    updateMetaTag('property', 'og:type', 'website');

    // Update Twitter meta tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:site', twitterSite);
    updateMetaTag('name', 'twitter:image', ogImage);
    updateMetaTag('name', 'twitter:title', ogTitle);
    updateMetaTag('name', 'twitter:description', ogDescription);

    // Debug logging to see what meta tags are being set
    console.log('🏷️ Meta Tags Updated:', {
      ogTitle,
      ogDescription,
      ogImage,
      twitterSite,
      ogUrl,
      environment: import.meta.env.MODE
    });
  }, []);

  // Helper function to update or create meta tags
  const updateMetaTag = (attributeName: string, attributeValue: string, content: string) => {
    let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    
    if (tag) {
      // Update existing tag
      tag.setAttribute('content', content);
    } else {
      // Create new tag if it doesn't exist
      tag = document.createElement('meta');
      tag.setAttribute(attributeName, attributeValue);
      tag.setAttribute('content', content);
      document.head.appendChild(tag);
    }
  };

  // This component doesn't render anything, it just updates the document head
  return null;
};

export default MetaTags;
