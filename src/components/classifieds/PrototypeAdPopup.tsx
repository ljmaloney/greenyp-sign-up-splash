
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import PrototypeAdCard from './PrototypeAdCard';
import { Classified } from '@/types/classifieds';
import { AdPackage } from '@/types/adPackages';

interface PrototypeAdPopupProps {
  adPackage: AdPackage;
}

const PrototypeAdPopup = ({ adPackage }: PrototypeAdPopupProps) => {
  const getPrototypeAd = (): Classified => {
    const baseAd = {
      id: `proto-${adPackage.adTypeId}`,
      category: 'Seeds & Plants',
      zipCode: '30309',
      email: 'gardener@email.com',
      phone: '(404) 555-1234',
      pricingTier: adPackage.adTypeId,
      contactObfuscated: adPackage.features.protectContact,
      createdAt: '2024-01-20T14:30:00Z',
      expiresAt: '2024-02-20T14:30:00Z'
    };

    if (adPackage.adTypeName === 'Basic') {
      return {
        ...baseAd,
        title: 'Organic Tomato Seeds - Heirloom Varieties',
        description: 'Fresh heirloom tomato seeds from my garden. Cherokee Purple, Brandywine, and Green Zebra varieties available. $3 per packet, minimum 5 packets. Seeds were harvested this season and properly dried. Perfect germination rate. Great for organic gardeners who want to grow their own food.',
        images: []
      };
    } else if (adPackage.adTypeName === 'Standard') {
      return {
        ...baseAd,
        title: 'Professional Lawn Mower - Barely Used',
        description: 'Commercial grade zero-turn mower, 54-inch cutting deck. Used for only one season on my property. Features include hydrostatic transmission, comfortable operator seat, and powerful 25HP engine. Excellent condition with all maintenance records. Perfect for landscaping professionals or large property owners. Includes extra blades and owner\'s manual.',
        category: 'Lawn Equipment',
        zipCode: '30305',
        images: [
          'https://images.unsplash.com/photo-1558618666-9c5e22e6203c?w=500',
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'
        ]
      };
    } else {
      return {
        ...baseAd,
        title: 'Complete Landscape Design & Installation Service',
        description: 'Full-service landscape architecture and installation company with 20+ years experience. We specialize in sustainable garden designs, native plant installations, and water-efficient irrigation systems. Our team includes certified arborists and landscape architects. Services include design consultation, 3D rendering, plant selection, hardscape installation, and ongoing maintenance packages. Licensed, bonded, and insured with excellent references available.',
        category: 'Landscaping Services',
        zipCode: '30308',
        images: [
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
          'https://images.unsplash.com/photo-1416431168657-a6c4f5c24e33?w=500',
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
          'https://images.unsplash.com/photo-1558618666-9c5e22e6203c?w=500',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'
        ]
      };
    }
  };

  const prototypeAd = getPrototypeAd();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-4 text-greenyp-600 border-greenyp-600 hover:bg-greenyp-50">
          <Eye className="w-4 h-4 mr-2" />
          Show example ad
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Example {adPackage.adTypeName} Ad</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <PrototypeAdCard classified={prototypeAd} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrototypeAdPopup;
