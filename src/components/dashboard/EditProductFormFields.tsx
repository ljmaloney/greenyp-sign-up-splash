import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EditProductFormData } from '@/hooks/useEditProductForm';
import MDEditor from "@uiw/react-md-editor";

interface EditProductFormFieldsProps {
  formData: EditProductFormData;
  onFieldChange: (field: string, value: string | number | boolean) => void;
}

const EditProductFormFields = ({ formData, onFieldChange }: EditProductFormFieldsProps) => {
  const productTypes = [
    { value: 'BAGGED_MATERIAL', label: 'Bagged Material - Bagged gravel, sand, decorative stone, mulches, etc' },
    { value: 'BOTANICAL', label: 'Botanical - Live plants, trees, shrubs, and flowers' },
    { value: 'BULK_MATERIAL', label: 'Bulk Material - Bulk gravel, soil, mulches, decorative stone, etc' },
    { value: 'CONTAINERS', label: 'Containers - Pots, starting trays, etc' },
    { value: 'DECORATIVE_STONE', label: 'Decorative Stone - Fieldstone, river rock, beach pebbles, etc' },
    { value: 'HARDWARE', label: 'Hardware - Miscellaneous hardware' },
    { value: 'LANDSCAPE_PRODUCTS', label: 'Landscape Products - Misc landscape products' },
    { value: 'LANDSCAPE_TOOLS', label: 'Landscape Tools - Landscaping tools and equipment' },
    { value: 'POND_MAINTENANCE', label: 'Pond Maintenance - Pond installation, pumps, etc' },
    { value: 'SOIL_AMENDMENTS', label: 'Soil Amendments - Soil amendments' }
  ];

  console.log('EditProductFormFields render - formData.availableQuantity:', formData.availableQuantity);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Type
        </label>
        <Select value={formData.productType} onValueChange={(value) => onFieldChange('productType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {productTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
          <MDEditor
              value={formData.description}
              onChange={(val) => onFieldChange('description', val || '')}
              data-color-mode="light"
              height={120}
              preview="edit"
              hideToolbar={false}
              visibleDragbar={false}
          />
        {/*<Textarea*/}
        {/*  value={formData.description}*/}
        {/*  onChange={(e) => onFieldChange('description', e.target.value)}*/}
        {/*  rows={3}*/}
        {/*  required*/}
        {/*/>*/}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Botanical Group (Genus and Species)
        </label>
        <Input
          value={formData.botanicalGroup}
          onChange={(e) => onFieldChange('botanicalGroup', e.target.value)}
          placeholder="e.g., Acer palmatum, Rosa damascena"
          disabled={formData.productType !== 'BOTANICAL'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Container Size
        </label>
        <Input
          value={formData.containerSize}
          onChange={(e) => onFieldChange('containerSize', e.target.value)}
          placeholder="e.g., 1 gallon, 25lb bag"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($) *
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => {
              console.log('Price field changed:', e.target.value);
              onFieldChange('price', Number(e.target.value));
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Quantity *
          </label>
          <Input
            type="number"
            value={formData.availableQuantity}
            onChange={(e) => {
              console.log('Quantity field changed:', e.target.value);
              onFieldChange('availableQuantity', Number(e.target.value));
            }}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="discontinued"
          checked={formData.discontinued}
          onCheckedChange={(checked) => onFieldChange('discontinued', checked as boolean)}
        />
        <label htmlFor="discontinued" className="text-sm font-medium text-gray-700">
          Mark as discontinued
        </label>
      </div>

      {formData.discontinued && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discontinue Date
            </label>
            <Input
              type="date"
              value={formData.discontinueDate}
              onChange={(e) => onFieldChange('discontinueDate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Order Date
            </label>
            <Input
              type="date"
              value={formData.lastOrderDate}
              onChange={(e) => onFieldChange('lastOrderDate', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductFormFields;
