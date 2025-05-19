
import React, { useState } from 'react';
import { TreeDeciduous, Shrub, LeafyGreen, Tractor, Shovel, Droplets, X, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define the categories with icons, titles, descriptions and additional details
const categories = [
  {
    title: "Landscaping",
    description: "Professional landscape design and installation services",
    icon: <Tractor className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
    details: "Find experts in residential and commercial landscaping, garden design, outdoor living spaces, native plant installations, and sustainable landscape solutions. Landscape professionals can help transform your property with custom designs tailored to your climate and preferences.",
    slug: "landscaping",
  },
  {
    title: "Lawn Care",
    description: "Regular maintenance, mowing, and lawn treatment specialists",
    icon: <LeafyGreen className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
    details: "Connect with lawn care providers offering services like regular mowing, fertilization, weed control, aeration, overseeding, pest management, and seasonal cleanup. Keep your lawn healthy year-round with professional care and maintenance.",
    slug: "lawn-care",
  },
  {
    title: "Hardscaping",
    description: "Patios, walkways, retaining walls, and outdoor structures",
    icon: <Shovel className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
    details: "Discover professionals who create durable and beautiful hardscape elements including patios, walkways, driveways, retaining walls, fire pits, outdoor kitchens, and decorative stone features that enhance your outdoor living spaces.",
    slug: "hardscaping",
  },
  {
    title: "Nurseries",
    description: "Plant nurseries offering trees, shrubs, and garden plants",
    icon: <TreeDeciduous className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
    details: "Browse local nurseries with wide selections of trees, shrubs, perennials, annuals, and specialty plants. Many nurseries offer expert advice, garden planning assistance, and delivery options for your plant purchases.",
    slug: "nurseries",
  },
  {
    title: "Plant Suppliers",
    description: "Seeds, bulbs, and specialty plant retailers",
    icon: <Shrub className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
    details: "Find suppliers specializing in seeds, bulbs, rare plants, native species, organic gardening supplies, and specialty growing media. These businesses often provide educational resources and growing guidance for gardeners of all levels.",
    slug: "plant-suppliers",
  },
  {
    title: "Pond & Water Features",
    description: "Installation and maintenance of ponds, fountains, and irrigation",
    icon: <Droplets className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
    details: "Connect with specialists in water feature design, installation, and maintenance including ponds, fountains, waterfalls, irrigation systems, rain gardens, and drainage solutions to enhance your landscape with the beauty of water.",
    slug: "water-features",
  },
];

const CategorySection = () => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const openCategoryDetails = (category: typeof categories[0]) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
    
    // Update the URL without page refresh for SEO benefits
    window.history.pushState(
      {}, 
      category.title, 
      `#category/${category.slug}`
    );
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    // Remove the hash from URL when closing
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Supported Industry Categories
          </h2>
          <p className="text-xl text-gray-700">
            Find qualified green industry professionals in your area by category
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 text-center transition-all hover:shadow-md hover:bg-gray-100 border border-greenyp-100"
            >
              {category.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
              <button 
                onClick={() => openCategoryDetails(category)}
                className="mt-6 inline-flex items-center text-greenyp-600 hover:text-greenyp-800 font-medium"
                aria-label={`Find ${category.title} Providers`}
              >
                Find Providers
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Category Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedCategory?.icon && React.cloneElement(selectedCategory.icon, { className: "w-6 h-6" })}
              {selectedCategory?.title}
            </DialogTitle>
            <DialogDescription className="text-base">{selectedCategory?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <p className="text-gray-700 mb-6">{selectedCategory?.details}</p>
            
            <h4 className="font-semibold text-lg mb-3">Top Providers</h4>
            <div className="space-y-3 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium">Green Thumb Experts</div>
                <div className="text-sm text-gray-600">⭐⭐⭐⭐⭐ (48 reviews)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium">Nature's Best</div>
                <div className="text-sm text-gray-600">⭐⭐⭐⭐ (36 reviews)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium">Leaf & Lawn Professional</div>
                <div className="text-sm text-gray-600">⭐⭐⭐⭐⭐ (29 reviews)</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                onClick={closeDialog}
                variant="outline"
                className="border-gray-300"
              >
                Close
              </Button>
              <Button 
                className="bg-greenyp-600 hover:bg-greenyp-700 text-white"
                onClick={() => {
                  window.location.href = `/categories/${selectedCategory?.slug}`;
                }}
              >
                View All Providers
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CategorySection;
