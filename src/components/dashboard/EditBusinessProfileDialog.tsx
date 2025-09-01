
import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useApiClient } from "@/hooks/useApiClient";

// Custom styles for MDEditor toolbar
const mdEditorStyles = `
  .w-md-editor .w-md-editor-toolbar {
    height: 48px !important;
    background: #f3f4f6 !important;
    border-bottom: 1px solid #cbd5e0 !important;
    padding: 8px 12px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li button {
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

  .w-md-editor .w-md-editor-toolbar ul li button:hover {
    background: #22c55e !important;
    color: white !important;
    border-color: #16a34a !important;
    box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2) !important;
    transform: translateY(-1px) !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li button.active {
    background: #16a34a !important;
    color: white !important;
    border-color: #15803d !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li.divider {
    height: 24px !important;
    margin: 4px 6px !important;
    border-left: 1px solid #cbd5e0 !important;
  }
`;

interface ProducerData {
  producerId: string;
  businessName: string;
  lineOfBusinessId: string;
  subscriptionId: string;
  subscriptionType: string;
  invoiceCycleType: string;
  websiteUrl: string;
  keywords: string;
  narrative: string;
}

interface LineOfBusiness {
  lineOfBusinessId: string;
  lineOfBusinessName: string;
  createDate: string;
  lastUpdateDate: string;
  createType: string;
  createByReference: string;
  shortDescription: string;
  description: string;
  enableDistanceRadius: boolean;
  iconName: string;
  iconFileName: string | null;
}

interface ProducerApiResponse {
  producer: {
    producerId: string;
    businessName: string;
    lineOfBusinessId: string;
    subscriptionType: string;
    websiteUrl?: string;
    narrative?: string;
    subscriptions?: {
      subscriptionId: string;
      invoiceCycleType: string;
    }[];
  };
}

interface EditBusinessProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  producer: {
    producerId: string;
    businessName: string;
    lineOfBusinessId: string;
    subscriptionType: string;
    websiteUrl?: string;
    keywords?: string | null;
    narrative?: string;
    subscriptions?: {
      subscriptionId: string;
      invoiceCycleType: string;
    }[];
  };
  lineOfBusinessOptions: LineOfBusiness[];
  onSuccess?: () => void;
}

const EditBusinessProfileDialog = ({ isOpen, onClose, producer, lineOfBusinessOptions, onSuccess }: EditBusinessProfileDialogProps) => {
  const [formData, setFormData] = useState<ProducerData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const apiClient = useApiClient();

  // Initialize form data when dialog opens
  useEffect(() => {
    if (isOpen && producer) {
      const subscription = producer.subscriptions?.[0]; // Get first subscription
      
      console.log('Initializing form with producer data:', producer);
      console.log('Available LOB options:', lineOfBusinessOptions);
      
      setFormData({
        producerId: producer.producerId,
        businessName: producer.businessName,
        lineOfBusinessId: producer.lineOfBusinessId,
        subscriptionId: subscription?.subscriptionId || '',
        subscriptionType: producer.subscriptionType,
        invoiceCycleType: subscription?.invoiceCycleType || 'MONTHLY',
        websiteUrl: producer.websiteUrl || '',
        keywords: producer.keywords || '',
        narrative: producer.narrative || ''
      });
    }
  }, [isOpen, producer, lineOfBusinessOptions]);



  // Validate website URL format
  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid (optional field)
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  // Clean and validate business narrative (remove quotes)
  const cleanNarrative = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
      .replace(/"/g, '')
      .replace(/[\u2013\u2014]/g, "-")// Remove all double quotes
      .replace(/[\u0000-\u001F]/g, c => c === '\n' ? '\n' : '') // Remove control characters
      .replace(/[ \t]+/g, ' ') // Multiple spaces to single space
      .trim();
  };

    const htmlToMarkdown = (html: string | null | undefined): string => {
        if (!html) return '';
        return html
            .replace(/<br\s*\/?>/gi, '\n')  // convert <br> or <br/> to \n
            .replace(/&nbsp;/gi, ' ')       // optional: decode non-breaking spaces
            .replace(/&lt;/gi, '<')         // decode HTML entities
            .replace(/&gt;/gi, '>')
            .replace(/&amp;/gi, '&')
            .trim();
    };
  // Clean and validate keywords
  const cleanKeywords = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
      .replace(/[^a-zA-Z0-9,\s]/g, '') // Only allow a-z, A-Z, 0-9, space, comma
      .replace(/\s*,\s*/g, ', ') // Standardize comma+space separation
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .trim()
      .replace(/,\s*$/, ''); // Remove trailing comma if any
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    // Validate website URL
    if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid website URL (e.g., example.com or http://example.com)',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Create a clean copy of the form data with validations
      const cleanData = {
        producerId: formData.producerId,
        businessName: formData.businessName?.trim() || '',
        lineOfBusinessId: formData.lineOfBusinessId,
        subscriptionId: formData.subscriptionId,
        subscriptionType: formData.subscriptionType,
        invoiceCycleType: formData.invoiceCycleType,
        websiteUrl: formData.websiteUrl?.trim() || '',
        keywords: cleanKeywords(formData.keywords),
        narrative: cleanNarrative(formData.narrative)
      };

      // Log the data being sent (for debugging)
      console.log('Sending update with data:', cleanData);
      
      // Make the API call with the properly structured payload
      const response = await apiClient.put(`/account/${formData.producerId}`, {
        producerId: formData.producerId,
        producerRequest: cleanData
      }, { 
        requireAuth: true 
      });
      
      if (response.error) {
        const errorMessage = typeof response.error === 'string' 
          ? response.error 
          : 'Failed to update business profile';
        throw new Error(errorMessage);
      }

      toast({
        title: "Profile Updated",
        description: "Your business profile has been successfully updated.",
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating business profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update business profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ProducerData, value: string) => {
    if (!formData) return;
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (!isOpen) return null;
  
  if (!formData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <style>{mdEditorStyles}</style>
        <DialogHeader>
          <DialogTitle>Edit Business Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <Input
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Line of Business
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenyp-600"
                value={formData.lineOfBusinessId}
                onChange={(e) => handleChange('lineOfBusinessId', e.target.value)}
                required
              >
                <option value="">Select a line of business</option>
                {(() => {
                  console.log('Rendering LOB options, count:', lineOfBusinessOptions.length);
                  console.log('LOB options:', lineOfBusinessOptions);
                  return lineOfBusinessOptions.map((lob) => (
                    <option key={lob.lineOfBusinessId} value={lob.lineOfBusinessId}>
                      {lob.lineOfBusinessName}
                    </option>
                  ));
                })()}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <Input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <Input
                value={formData.keywords}
                onChange={(e) => {
                  // Only allow valid characters: A-Z, a-z, 0-9, space, and comma
                  const cleanValue = e.target.value.replace(/[^A-Za-z0-9 ,]/g, '');
                  handleChange('keywords', cleanValue);
                }}
                placeholder="Enter keywords for your business separated by commas"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Narrative
            </label>
              <style>
                  {`
                    .editor-wrapper .w-md-editor-toolbar {
                        background-color: #f0f4f8 !important;
                        border-radius: 12px 12px 0 0;
                        padding: 0.5rem 1rem;
                        width: 100%;                          /* full width */
                        box-sizing: border-box;    
                    }
                    .editor-wrapper .w-md-editor-toolbar > button { color: #fff; }
                    .editor-wrapper .w-md-editor-header { padding: 0;  }
                `}
              </style>
            <div className="editor-wrapper focus-within:ring-2 focus-within:ring-greenyp-600 focus-within:border-greenyp-600 rounded-md">
              <MDEditor
                  value={htmlToMarkdown(formData.narrative)}
                  onChange={(val) => handleChange('narrative', val || '')}
                  data-color-mode="light"
                  className="w-full border border-gray-300 rounded-md"
                  height={300}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  style={{
                      borderRadius: 12, padding: 8, fontFamily: "Inter, sans-serif", overflow: "hidden",
                  }}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-greenyp-600 hover:bg-greenyp-700" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
// @ts-ignore
export default EditBusinessProfileDialog;