
import React, {Fragment, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { useClassifiedCategories } from '@/hooks/classifieds/useClassifiedCategories';

// Custom styles for MDEditor toolbar - matching EditBusinessProfileDialog
const mdEditorStyles = `
  .ad-details-editor .w-md-editor .w-md-editor-toolbar {
    height: 48px !important;
    background: #f3f4f6 !important;
    border-bottom: 1px solid #cbd5e0 !important;
    padding: 8px 12px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  }

  .ad-details-editor .w-md-editor .w-md-editor-toolbar ul li button {
    height: 32px !important;
    width: 32px !important;
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 6px !important;
    margin: 0 2px !important;
    color: #4a5568 !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.2s ease !important;
  }

  .ad-details-editor .w-md-editor .w-md-editor-toolbar ul li button:hover {
    background: #22c55e !important;
    color: white !important;
    border-color: #16a34a !important;
    box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2) !important;
    transform: translateY(-1px) !important;
  }

  .ad-details-editor .w-md-editor .w-md-editor-toolbar ul li button.active {
    background: #16a34a !important;
    color: white !important;
    border-color: #15803d !important;
  }

  .ad-details-editor .w-md-editor .w-md-editor-toolbar ul li.divider {
    height: 24px !important;
    margin: 4px 6px !important;
    border-left: 1px solid #cbd5e0 !important;
  }
`;

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

  const activeCategories = categoriesData?.response?.filter(cat => cat.active) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Ad Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
          <style>{mdEditorStyles}</style>
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
            <div className="ad-details-editor focus-within:ring-2 focus-within:ring-greenyp-600 focus-within:border-greenyp-600 rounded-md">
          <MDEditor
            value={description}
            onChange={(val) => onFieldChange('description', val || '')}
            data-color-mode="light"
            height={150}
            preview="edit"
            hideToolbar={false}
            visibleDragbar={false}
            className="w-full border border-gray-300 rounded-md"/>
            </div>
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
