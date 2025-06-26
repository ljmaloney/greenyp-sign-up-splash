
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List } from 'lucide-react';

interface AdDetailsFormProps {
  title: string;
  description: string;
  category: string;
  price?: string;
  per?: string;
  onFieldChange: (field: string, value: string) => void;
}

const AdDetailsForm = ({ 
  title, 
  description, 
  category, 
  price, 
  per, 
  onFieldChange 
}: AdDetailsFormProps) => {
  const categories = [
    'Electronics',
    'Vehicles', 
    'Real Estate',
    'Jobs',
    'Services',
    'For Sale',
    'Wanted',
    'Community'
  ];

  const perOptions = [
    'each',
    'hour',
    'day',
    'week',
    'month',
    'year',
    'dozen',
    'pound',
    'gallon'
  ];

  const insertMarkup = (markup: string) => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = description.substring(start, end);
      const beforeText = description.substring(0, start);
      const afterText = description.substring(end);
      
      let newText = '';
      switch (markup) {
        case 'bold':
          newText = `${beforeText}**${selectedText || 'bold text'}**${afterText}`;
          break;
        case 'italic':
          newText = `${beforeText}*${selectedText || 'italic text'}*${afterText}`;
          break;
        case 'list':
          newText = `${beforeText}\n• ${selectedText || 'list item'}${afterText}`;
          break;
      }
      
      onFieldChange('description', newText);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value) => onFieldChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
                id="price"
                value={price || ''}
                onChange={(e) => onFieldChange('price', e.target.value)}
                placeholder="Enter price"
            />
          </div>

          <div>
            <Label htmlFor="per">Per (optional)</Label>
            <Select value={per} onValueChange={(value) => onFieldChange('per', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {perOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="title" className="block text-left">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="Enter ad title"
            required
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="description" className="block text-left">Description * (Max 512 characters)</Label>
          <div className="space-y-2">
            <div className="flex gap-1 border-2 border-yellow-500 bg-gray-100 rounded-md p-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkup('bold')}
                className="h-8 w-8 p-0"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkup('italic')}
                className="h-8 w-8 p-0"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkup('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => onFieldChange('description', e.target.value)}
              placeholder="Describe your item or service. Use ** for bold text, * for italic text, and • for bullet points."
              maxLength={512}
              required
              className="min-h-[200px] resize-y"
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>Use **bold**, *italic*, and • for bullet points</div>
              <div>{description.length}/512 characters</div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default AdDetailsForm;
