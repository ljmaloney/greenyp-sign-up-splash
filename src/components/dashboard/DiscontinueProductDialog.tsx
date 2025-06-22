
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { discontinueProduct } from '@/services/productService';

interface DiscontinueProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  productName?: string;
  onProductDiscontinued: () => void;
}

const DiscontinueProductDialog = ({ 
  isOpen, 
  onClose, 
  productId, 
  productName,
  onProductDiscontinued 
}: DiscontinueProductDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [discontinueDate, setDiscontinueDate] = useState('');
  const [lastOrderDate, setLastOrderDate] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    
    setIsLoading(true);
    
    try {
      await discontinueProduct({
        productId,
        discontinueDate,
        lastOrderDate
      });
      
      toast({
        title: "Product Discontinued",
        description: "The product has been successfully discontinued.",
      });
      
      onProductDiscontinued();
      onClose();
      setDiscontinueDate('');
      setLastOrderDate('');
    } catch (error) {
      console.error('Error discontinuing product:', error);
      toast({
        title: "Discontinue Failed",
        description: "Failed to discontinue product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Discontinue Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to discontinue "{productName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discontinue Date *
              </label>
              <Input
                type="date"
                value={discontinueDate}
                onChange={(e) => setDiscontinueDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Order Date *
              </label>
              <Input
                type="date"
                value={lastOrderDate}
                onChange={(e) => setLastOrderDate(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="destructive" 
                disabled={isLoading}
              >
                {isLoading ? 'Discontinuing...' : 'Discontinue Product'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscontinueProductDialog;
