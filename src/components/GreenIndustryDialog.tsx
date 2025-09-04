
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { TreeDeciduous, Droplets, Home, Wrench } from 'lucide-react';

interface GreenIndustryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const GreenIndustryDialog = ({ isOpen, onClose }: GreenIndustryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-greenyp-700 mb-4">
            What is the Green Industry?
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                It's all about creating and caring for the outdoor spaces that make our homes, neighborhoods,
                  and communities more beautiful, healthy, and enjoyable.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <TreeDeciduous className="w-8 h-8 text-greenyp-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Landscaping & Design</h4>
                    <p className="text-sm text-gray-600">
                        Create and maintain beautiful outdoor spaces through professional design, installation, and maintenance services.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Droplets className="w-8 h-8 text-greenyp-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Care & Maintenance</h4>
                    <p className="text-sm text-gray-600">Lawn and tree care, irrigation systems, and turf management to keep spaces healthy.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Home className="w-8 h-8 text-greenyp-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Garden Centers & Nurseries</h4>
                    <p className="text-sm text-gray-600">Plants, gardening supplies, and expertise from garden centers, nurseries, and greenhouses.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Wrench className="w-8 h-8 text-greenyp-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Outdoor Improvements</h4>
                    <p className="text-sm text-gray-600">Patios, retaining walls, lighting, water features, and equipment providers.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-greenyp-50 p-4 rounded-lg border border-greenyp-100">
                <p className="text-gray-700">
                  Whether it's designing a backyard, maintaining a lawn, building community spaces, or property maintenance,
                    these businesses help you the outdoors while also maintaining and improving and property value.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GreenIndustryDialog;
