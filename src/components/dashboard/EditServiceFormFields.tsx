
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditServiceFormData } from '@/hooks/useEditServiceForm';

interface EditServiceFormFieldsProps {
  formData: EditServiceFormData;
  onFieldChange: (field: string, value: string | number) => void;
}

const EditServiceFormFields = ({ formData, onFieldChange }: EditServiceFormFieldsProps) => {
  const priceUnitTypes = [
    { value: 'FIXED_ESTIMATE', label: 'Fixed Estimate' },
    { value: 'PER_HOUR', label: 'Per Hour' },
    { value: 'PER_VISIT', label: 'Per Visit' },
    { value: 'PER_MILE', label: 'Per Mile' },
    { value: 'LOT_SIZE', label: 'By Lot Size' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Short Description *
        </label>
        <Input
          value={formData.shortDescription}
          onChange={(e) => onFieldChange('shortDescription', e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Description *
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price Units Type
        </label>
        <Select value={formData.priceUnitsType} onValueChange={(value) => onFieldChange('priceUnitsType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priceUnitTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price ($) *
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.minServicePrice}
            onChange={(e) => onFieldChange('minServicePrice', Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price ($) *
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.maxServicePrice}
            onChange={(e) => onFieldChange('maxServicePrice', Number(e.target.value))}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Terms
        </label>
        <Textarea
          value={formData.serviceTerms}
          onChange={(e) => onFieldChange('serviceTerms', e.target.value)}
          rows={3}
          placeholder="Terms and conditions for this service..."
        />
      </div>
    </div>
  );
};

export default EditServiceFormFields;
