
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploadZone from './ImageUploadZone';
import { ClassifiedFormData, PRICING_TIERS } from '@/types/classifieds';
import { useToast } from '@/hooks/use-toast';

interface ExtendedClassifiedFormData extends ClassifiedFormData {
  price?: string;
  per?: string;
  address?: string;
  city?: string;
  state?: string;
}

const CreateAdForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ExtendedClassifiedFormData>({
    title: '',
    description: '',
    category: '',
    price: '',
    per: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    pricingTier: 'basic',
    images: []
  });

  const categories = [
    'Electronics',
    'Vehicles', 
    'Real Estate',
    'Jobs',
    'Services',
    'For Sale',
    'Wanted',
    'Community'
  ];

  const perOptions = [
    'each',
    'hour',
    'day',
    'week',
    'month',
    'year',
    'dozen',
    'pound',
    'gallon'
  ];

  const handleInputChange = (field: keyof ExtendedClassifiedFormData, value: string | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.category || 
        !formData.zipCode || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedTier = PRICING_TIERS[formData.pricingTier];
    if (formData.images.length > selectedTier.maxImages) {
      toast({
        title: "Error",
        description: `Too many images for ${selectedTier.name} tier. Maximum: ${selectedTier.maxImages}`,
        variant: "destructive"
      });
      return;
    }

    // Here you would normally submit to your API
    console.log('Submitting classified ad:', formData);
    
    toast({
      title: "Success!",
      description: `Your ad has been posted! You will be charged $${selectedTier.price}/month.`,
    });
  };

  const selectedTier = PRICING_TIERS[formData.pricingTier];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pricing Tier Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Ad Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(PRICING_TIERS).map(([key, tier]) => (
              <Button
                key={key}
                type="button"
                variant="outline"
                onClick={() => handleInputChange('pricingTier', key)}
                className={`h-auto p-4 flex flex-col items-start text-left space-y-2 ${
                  formData.pricingTier === key 
                    ? 'bg-gray-100 border-yellow-500 border-2' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold text-lg">{tier.name}</div>
                <div className="text-2xl font-bold text-greenyp-600">${tier.price}/month</div>
                <div className="text-sm text-gray-600">{tier.description}</div>
                <div className="text-sm text-gray-500">Max images: {tier.maxImages}</div>
                {tier.contactObfuscation && (
                  <div className="text-xs text-green-600 font-medium">+ Contact Privacy</div>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ad Details */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter ad title"
              required
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="description">Description * (Max 512 characters)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your item or service"
              maxLength={512}
              required
              className="min-h-[100px]"
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.description.length}/512 characters
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Enter price"
              />
            </div>

            <div>
              <Label htmlFor="per">Per (optional)</Label>
              <Select value={formData.per} onValueChange={(value) => handleInputChange('per', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {perOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-4">
              The address information provided is used to determine location for sorting purposes and is shown on the website to help buyers find your item or service.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>

              <div>
                <Label htmlFor="zipCode">Zip Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter zip code"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      {selectedTier.maxImages > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Images (Up to {selectedTier.maxImages})</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploadZone
              images={formData.images}
              maxImages={selectedTier.maxImages}
              onImagesChange={(images) => handleInputChange('images', images)}
            />
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          {selectedTier.contactObfuscation && (
            <p className="text-sm text-green-600">Your contact details will be partially hidden for privacy</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-semibold">Total: ${selectedTier.price}/month</div>
              <div className="text-sm text-gray-600">Ad will run for 30 days</div>
            </div>
            <Button type="submit" size="lg" className="bg-greenyp-600 hover:bg-greenyp-700">
              Post Ad - ${selectedTier.price}/month
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default CreateAdForm;
