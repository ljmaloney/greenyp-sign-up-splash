
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES_AND_TERRITORIES } from '@/constants/usStates';

interface StateSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const StateSelect = ({ value, onValueChange, placeholder = "Select state", disabled = false }: StateSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white max-h-60 overflow-y-auto z-50">
        {US_STATES_AND_TERRITORIES.map((state) => (
          <SelectItem key={state} value={state}>
            {state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StateSelect;
