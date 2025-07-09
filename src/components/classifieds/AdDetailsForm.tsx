
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';

interface AdDetailsFormProps {
  title: string;
  description: string;
  category: string;
  price?: string;
  per?: string;
  onFieldChange: (field: string, value: string | File[]) => void;
}

const AdDetailsForm = ({ 
  title, 
  description, 
  category, 
  price, 
  per, 
  onFieldChange 
}: AdDetailsFormProps) => {
  const { data: categoriesData } = useClassifiedCategories();

  const validPerOptions = [
    'Each',
    'Dozen'
  ];

  const activeCategories = categoriesData?.response?.filter(cat => cat.active) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Ad Details</CardTitle>
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
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Describe your item or service"
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={category} onValueChange={(value) => onFieldChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {activeCategories.length > 0 ? (
                activeCategories.map((cat) => (
                  <SelectItem key={cat.categoryId} value={cat.categoryId}>
                    {cat.name} - {cat.shortDescription}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (optional)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price || ''}
              onChange={(e) => onFieldChange('price', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="per">Per (optional)</Label>
            <Select value={per || ''} onValueChange={(value) => onFieldChange('per', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {validPerOptions.map((option) => (
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
