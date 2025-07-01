import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import CategoryDescriptionsDialog from './CategoryDescriptionsDialog';

interface AdDetailsFormProps {
  title: string;
  description: string;
  category: string;
  price?: string;
  per?: string;
  onFieldChange: (field: string, value: string) => void;
}

const AdDetailsForm = ({ title, description, category, price, per, onFieldChange }: AdDetailsFormProps) => {
  const { data: categoriesData } = useClassifiedCategories();
  const categories = categoriesData?.response?.filter(cat => cat.active).sort((a, b) => a.name.localeCompare(b.name)) || [];

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
            type="text"
            placeholder="Enter ad title"
            value={title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your item or service"
            value={description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            rows={4}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="category">Category *</Label>
            <CategoryDescriptionsDialog />
          </div>
          <Select value={category} onValueChange={(value) => onFieldChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.categoryId} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (Optional)</Label>
            <Input
              id="price"
              type="text"
              placeholder="Enter price"
              value={price || ''}
              onChange={(e) => onFieldChange('price', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="per">Per (Optional)</Label>
            <Select value={per || ''} onValueChange={(value) => onFieldChange('per', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="each">Each</SelectItem>
                <SelectItem value="dozen">Dozen</SelectItem>
                <SelectItem value="pound">Pound</SelectItem>
                <SelectItem value="bushel">Bushel</SelectItem>
                <SelectItem value="hour">Hour</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdDetailsForm;
