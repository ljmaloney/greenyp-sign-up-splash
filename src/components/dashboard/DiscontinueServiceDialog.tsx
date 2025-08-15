
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { discontinueService } from '@/services/serviceService';

interface DiscontinueServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
  serviceName?: string;
  onServiceDiscontinued: () => void;
}

const DiscontinueServiceDialog = ({ 
  isOpen, 
  onClose, 
  serviceId, 
  serviceName,
  onServiceDiscontinued 
}: DiscontinueServiceDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [discontinueDate, setDiscontinueDate] = useState(() => {
    // Default to current date
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId) return;
    
    setIsLoading(true);
    
    try {
      await discontinueService(serviceId, {
        discontinueDate
      });
      
      toast({
        title: "Service Discontinued",
        description: "The service has been successfully discontinued.",
      });
      
      onServiceDiscontinued();
      onClose();
      // Reset to current date for next use
      const today = new Date();
      setDiscontinueDate(today.toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error discontinuing service:', error);
      toast({
        title: "Discontinue Failed",
        description: "Failed to discontinue service. Please try again.",
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
          <DialogTitle>Discontinue Service</DialogTitle>
          <DialogDescription>
            Are you sure you want to discontinue "{serviceName}"? This action cannot be undone.
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
                {isLoading ? 'Discontinuing...' : 'Discontinue Service'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscontinueServiceDialog;
