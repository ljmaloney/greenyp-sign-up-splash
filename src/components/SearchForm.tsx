import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchFormProps {
  showHeading?: boolean;
}

const SearchForm = ({ showHeading = true }: SearchFormProps) => {
  const [searchParams] = useSearchParams();
  const { lineOfBusinessId } = useParams<{ lineOfBusinessId?: string }>();
  const navigate = useNavigate();
  
  // Get initial values from URL parameters or lineOfBusinessId from category page
  const initialZipCode = searchParams.get('zipCode') || '';
  const initialDistance = searchParams.get('distance') || '25';
  const initialCategory = searchParams.get('category') || lineOfBusinessId || '';
  const initialSearchText = searchParams.get('searchText') || '';
  
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [distance, setDistance] = useState(initialDistance);
  const [customDistance, setCustomDistance] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [isCustomDistance, setIsCustomDistance] = useState(false);
  
  const { data: categories } = useCategories();

  // Check if the initial distance is a custom value (not in predefined options)
  const distanceOptions = ['15', '25', '50', '75', '100', '150'];
  
  useEffect(() => {
    if (initialDistance && !distanceOptions.includes(initialDistance)) {
      setIsCustomDistance(true);
      setCustomDistance(initialDistance);
      setDistance('');
    }
  }, [initialDistance]);

  // Update selected category when lineOfBusinessId changes (for category pages)
  useEffect(() => {
    if (lineOfBusinessId && lineOfBusinessId !== selectedCategory) {
      setSelectedCategory(lineOfBusinessId);
    }
  }, [lineOfBusinessId, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim()) return;

    const searchParams = new URLSearchParams({
      zipCode: zipCode.trim(),
      distance: isCustomDistance && customDistance ? customDistance : distance,
      ...(selectedCategory && { category: selectedCategory }), // Keep as 'category' for URL consistency
      ...(searchText.trim() && { searchText: searchText.trim() }),
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
    <section className="pt-0 pb-6 px-4 md:px-8 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        {showHeading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Green Industry Professionals Near You</h2>
            <p className="text-lg text-gray-600">Search for landscapers, gardeners, nurseries, and more in your area</p>
          </div>
        )}
        
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
          </div>

          {/* Free-form text search */}
          <div className="mb-6">
            <Label htmlFor="searchText">Search Keywords (Optional)</Label>
            <Input
              id="searchText"
              type="text"
              placeholder="Enter keywords to search for specific services, business names, or specialties..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="mt-2"
            />
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
