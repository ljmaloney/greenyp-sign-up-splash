
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceFormData } from '@/hooks/useServiceForm';

interface Location {
  id: string;
  name: string;
  address: string;
}

interface ServiceFormFieldsProps {
  formData: ServiceFormData;
  onFieldChange: (field: string, value: string | number) => void;
  locations: Location[];
}

const ServiceFormFields = ({ formData, onFieldChange, locations }: ServiceFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <Select value={formData.producerLocationId} onValueChange={(value) => onFieldChange('producerLocationId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                <div>
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-gray-500">{location.address}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Name *
        </label>
        <Input
          value={formData.shortDescription}
          onChange={(e) => onFieldChange('shortDescription', e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          rows={3}
          required
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price ($) *
          </label>
          <Input
            type="number"
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
            value={formData.maxServicePrice}
            onChange={(e) => onFieldChange('maxServicePrice', Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Units Type *
          </label>
          <Select value={formData.priceUnitsType} onValueChange={(value) => onFieldChange('priceUnitsType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select price unit type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOT_SIZE">
                <div>
                  <div className="font-medium">Lot size</div>
                  <div className="text-sm text-gray-500">Priced based on size of lot</div>
                </div>
              </SelectItem>
              <SelectItem value="PER_HOUR">
                <div>
                  <div className="font-medium">Per hour</div>
                  <div className="text-sm text-gray-500">Price based on time in hour increments</div>
                </div>
              </SelectItem>
              <SelectItem value="PER_MILE">
                <div>
                  <div className="font-medium">Per mile</div>
                  <div className="text-sm text-gray-500">Price based on number of loaded miles</div>
                </div>
              </SelectItem>
              <SelectItem value="PER_MILE_RANGE">
                <div>
                  <div className="font-medium">Per mile (range)</div>
                  <div className="text-sm text-gray-500">Price based on a range of miles</div>
                </div>
              </SelectItem>
              <SelectItem value="PER_VISIT">
                <div>
                  <div className="font-medium">Per visit</div>
                  <div className="text-sm text-gray-500">Price per visit</div>
                </div>
              </SelectItem>
              <SelectItem value="FIXED_ESTIMATE">
                <div>
                  <div className="font-medium">Estimate</div>
                  <div className="text-sm text-gray-500">Priced determined per contract after estimate</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Terms
        </label>
        <Textarea
          value={formData.serviceTerms}
          onChange={(e) => onFieldChange('serviceTerms', e.target.value)}
          rows={2}
          placeholder="Terms and conditions for this service"
        />
      </div>
    </div>
  );
};

export default ServiceFormFields;
