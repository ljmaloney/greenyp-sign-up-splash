
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category {
  categoryId: string;
  name: string;
  shortDescription: string;
}

interface AdDetailsFormCardProps {
  formData: {
    categoryId: string;
    price: string;
    pricePerUnitType: string;
    title: string;
    description: string;
  };
  categories: Category[];
  onFieldChange: (field: string, value: string) => void;
}

const AdDetailsFormCard = ({ formData, categories, onFieldChange }: AdDetailsFormCardProps) => {
  const validPerOptions = [
    'Bale',
    'Board Foot',
    'Bushel',
    'Dozen',
    'Each',
    'Gallon',
    'Pint',
    'Pound',
    'Quart'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Your Ad Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.categoryId} onValueChange={(value) => onFieldChange('categoryId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {categories.map((cat) => (
                <SelectItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.name} - {cat.shortDescription}
                </SelectItem>
              ))}
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
              value={formData.price}
              onChange={(e) => onFieldChange('price', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="per">Per (optional)</Label>
            <Select value={formData.pricePerUnitType} onValueChange={(value) => onFieldChange('pricePerUnitType', value)}>
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

        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="Enter ad title"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <MDEditor
            value={formData.description}
            onChange={(val) => onFieldChange('description', val || '')}
            data-color-mode="light"
            height={300}
            preview="preview"
            hideToolbar={false}
            visibleDragbar={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdDetailsFormCard;
