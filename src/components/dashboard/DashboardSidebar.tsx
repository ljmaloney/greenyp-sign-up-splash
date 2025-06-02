
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  User, 
  MapPin, 
  Users, 
  Package, 
  Wrench, 
  CreditCard, 
  Crown,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const location = useLocation();
  const { data: subscriptions } = useSubscriptions();
  
  // Mock current subscription - in real app this would come from user context
  const currentSubscription = subscriptions?.[0]; // Basic Listing for demo
  const hasProducts = currentSubscription?.features.some(feature => 
    feature.toLowerCase().includes('products')
  );
  const hasServices = currentSubscription?.features.some(feature => 
    feature.toLowerCase().includes('services')
  );

  const menuItems = [
    {
      label: 'Business Profile',
      icon: User,
      href: '/dashboard',
      enabled: true
    },
    {
      label: 'Locations',
      icon: MapPin,
      href: '/dashboard/locations',
      enabled: true
    },
    {
      label: 'Contacts',
      icon: Users,
      href: '/dashboard/contacts',
      enabled: true
    },
    {
      label: 'Products',
      icon: Package,
      href: '/dashboard/products',
      enabled: hasProducts
    },
    {
      label: 'Services',
      icon: Wrench,
      href: '/dashboard/services',
      enabled: hasServices
    }
  ];

  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = location.pathname === item.href;
    
    if (!item.enabled) {
      return (
        <Link to="/dashboard/upgrade" className="block">
          <div className={cn(
            "flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1",
            "text-gray-400 hover:bg-gray-100 cursor-pointer"
          )}>
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
            <Crown className="ml-auto h-4 w-4 text-yellow-500" />
          </div>
        </Link>
      );
    }

    return (
      <Link to={item.href} onClick={() => onClose()}>
        <div className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors",
          isActive 
            ? "bg-greenyp-100 text-greenyp-700" 
            : "text-gray-700 hover:bg-gray-100"
        )}>
          <item.icon className="mr-3 h-5 w-5" />
          {item.label}
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <span className="text-lg font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <MenuItem key={item.href} item={item} />
          ))}
          
          <div className="border-t pt-4 mt-4">
            <Link to="/dashboard/subscription" onClick={() => onClose()}>
              <div className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors",
                location.pathname === '/dashboard/subscription'
                  ? "bg-greenyp-100 text-greenyp-700" 
                  : "text-gray-700 hover:bg-gray-100"
              )}>
                <Crown className="mr-3 h-5 w-5" />
                Change Subscription
              </div>
            </Link>
            
            <Link to="/dashboard/payment" onClick={() => onClose()}>
              <div className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors",
                location.pathname === '/dashboard/payment'
                  ? "bg-greenyp-100 text-greenyp-700" 
                  : "text-gray-700 hover:bg-gray-100"
              )}>
                <CreditCard className="mr-3 h-5 w-5" />
                Update Payment Info
              </div>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;
