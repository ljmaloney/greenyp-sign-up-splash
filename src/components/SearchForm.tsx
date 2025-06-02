
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useCategoryServices } from "@/hooks/useCategoryServices";
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchFormProps {
  showHeading?: boolean;
}

const SearchForm = ({ showHeading = true }: SearchFormProps) => {
  const [searchParams] = useSearchParams();
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  
  // Get initial values from URL parameters or slug
  const initialZipCode = searchParams.get('zipCode') || '';
  const initialDistance = searchParams.get('distance') || '25';
  const initialCategory = searchParams.get('category') || slug || '';
  const initialService = searchParams.get('service') || '';
  
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [distance, setDistance] = useState(initialDistance);
  const [customDistance, setCustomDistance] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedService, setSelectedService] = useState(initialService);
  const [isCustomDistance, setIsCustomDistance] = useState(false);
  
  const { data: categories } = useCategories();
  const { data: services } = useCategoryServices(selectedCategory);

  // Check if the initial distance is a custom value (not in predefined options)
  const distanceOptions = ['15', '25', '50', '75', '100', '150'];
  
  useEffect(() => {
    if (initialDistance && !distanceOptions.includes(initialDistance)) {
      setIsCustomDistance(true);
      setCustomDistance(initialDistance);
      setDistance('');
    }
  }, [initialDistance]);

  // Update selected category when slug changes (for category pages)
  useEffect(() => {
    if (slug && slug !== selectedCategory) {
      setSelectedCategory(slug);
      setSelectedService(''); // Reset service when category changes
    }
  }, [slug, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim()) return;

    const searchParams = new URLSearchParams({
      zipCode: zipCode.trim(),
      distance: isCustomDistance && customDistance ? customDistance : distance,
      ...(selectedCategory && { category: selectedCategory }),
      ...(selectedService && { service: selectedService }),
    });

    navigate(`/search?${searchParams.toString()}`);
  };

  const handleDistanceChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomDistance(true);
      setDistance('');
    } else {
      setIsCustomDistance(false);
      setDistance(value);
      setCustomDistance('');
    }
  };

  return (
    <section className="py-12 px-4 md:px-8 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        {showHeading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Green Industry Professionals Near You</h2>
            <p className="text-lg text-gray-600">Search for landscapers, gardeners, nurseries, and more in your area</p>
          </div>
        )}
        
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Zip Code */}
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code *</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="Enter zip code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                maxLength={5}
                pattern="[0-9]{5}"
              />
            </div>

            {/* Distance */}
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (miles)</Label>
              {isCustomDistance ? (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Custom miles"
                    value={customDistance}
                    onChange={(e) => setCustomDistance(e.target.value)}
                    min="1"
                    max="500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCustomDistance(false)}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <Select value={distance} onValueChange={handleDistanceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance" />
                  </SelectTrigger>
                  <SelectContent>
                    {distanceOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option} miles
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom distance</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Select value={selectedCategory} onValueChange={(value) => {
                setSelectedCategory(value);
                setSelectedService(''); // Reset service when category changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.lineOfBusinessId} value={category.lineOfBusinessId}>
                      {category.lineOfBusinessName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <Label htmlFor="service">Services (Optional)</Label>
              <Select 
                value={selectedService} 
                onValueChange={setSelectedService}
                disabled={!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedCategory ? "Select service" : "Select category first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services?.map((service) => (
                    <SelectItem key={service.lobServiceId} value={service.lobServiceId}>
                      {service.serviceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center">
            <Button type="submit" size="lg" className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8">
              <Search className="w-5 h-5 mr-2" />
              Search Now
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchForm;
