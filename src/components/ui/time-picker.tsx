
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
}

const TimePicker = ({ value, onChange, placeholder = "Select time", className }: TimePickerProps) => {
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');
  const [period, setPeriod] = useState<string>('AM');

  // Parse initial value
  useEffect(() => {
    if (value) {
      const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
      if (match) {
        const [, h, m, p] = match;
        setHour(h);
        setMinute(m);
        setPeriod(p?.toUpperCase() || 'AM');
      }
    }
  }, [value]);

  // Format and send time when components change
  useEffect(() => {
    if (hour && minute) {
      const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
      onChange(formattedTime);
    }
  }, [hour, minute, period, onChange]);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <Select value={hour} onValueChange={setHour}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder="Hr" />
        </SelectTrigger>
        <SelectContent>
          {hours.map(h => (
            <SelectItem key={h} value={h}>{h}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <span className="text-gray-500">:</span>
      
      <Select value={minute} onValueChange={setMinute}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map(m => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export { TimePicker };
