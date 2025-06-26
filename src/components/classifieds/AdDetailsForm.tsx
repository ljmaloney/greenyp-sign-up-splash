
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdDetailsFormProps {
  title: string;
  description: string;
  category: string;
  price?: string;
  per?: string;
  onFieldChange: (field: string, value: string) => void;
}

const AdDetailsForm = ({ 
  title, 
  description, 
  category, 
  price, 
  per, 
  onFieldChange 
}: AdDetailsFormProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="Enter ad title"
            required
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="description">Description * (Max 512 characters)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Describe your item or service"
            maxLength={512}
            required
            className="min-h-[100px]"
          />
          <div className="text-sm text-gray-500 mt-1">
            {description.length}/512 characters
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value) => onFieldChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={price || ''}
              onChange={(e) => onFieldChange('price', e.target.value)}
              placeholder="Enter price"
            />
          </div>

          <div>
            <Label htmlFor="per">Per (optional)</Label>
            <Select value={per} onValueChange={(value) => onFieldChange('per', value)}>
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
      </CardContent>
    </Card>
  );
};

export default AdDetailsForm;
