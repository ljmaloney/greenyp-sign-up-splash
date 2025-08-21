
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
  defaultPeriod?: 'AM' | 'PM';
}

const TimePicker = ({ value, onChange, placeholder = "Select time", className, defaultPeriod = 'AM' }: TimePickerProps) => {
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');
  const [period, setPeriod] = useState<string>(defaultPeriod);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
      if (match) {
        const [, h, m, p] = match;
        setHour(h);
        setMinute(m);
        setPeriod(p?.toUpperCase() || defaultPeriod);
      }
    } else {
      // Reset to default period when no value
      setPeriod(defaultPeriod);
    }
  }, [value, defaultPeriod]);

  // Format and send time when components change - but only if all required parts are present
  useEffect(() => {
    if (hour && minute && period) {
      const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
      console.log('TimePicker: Sending formatted time:', formattedTime, { hour, minute, period });
      onChange(formattedTime);
    } else if (value) {
      // If we have a value but are missing parts, keep the existing value
      const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
      if (match) {
        const [, h, m, p] = match;
        if (!hour && h) setHour(h);
        if (!minute && m) setMinute(m);
        if (!period && p) setPeriod(p.toUpperCase());
      }
    }
  }, [hour, minute, period, onChange, value]);

  const handleHourChange = (newHour: string) => {
    console.log('TimePicker: Hour changed to:', newHour, 'Current state:', { hour, minute, period });
    setHour(newHour);
  };

  const handleMinuteChange = (newMinute: string) => {
    console.log('TimePicker: Minute changed to:', newMinute, 'Current state:', { hour, minute, period });
    setMinute(newMinute);
  };

  const handlePeriodChange = (newPeriod: string) => {
    console.log('TimePicker: Period changed to:', newPeriod, 'Current state:', { hour, minute, period });
    setPeriod(newPeriod);
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Select value={hour} onValueChange={handleHourChange}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder="Hr" />
        </SelectTrigger>
        <SelectContent className="z-[250]">
          {hours.map(h => (
            <SelectItem key={h} value={h}>{h}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <span className="text-gray-500 px-1">:</span>
      
      <Select value={minute} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent className="z-[250]">
          {minutes.map(m => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[250]">
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export { TimePicker };
