
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  MapPin,
  Users,
  Package,
  Wrench,
  CreditCard,
  Crown,
  Receipt,
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
  const { data: subscriptions, isLoading, error } = useSubscriptions();

  // Mock current user's subscription ID - in a real app, this would come from user context
  const currentSubscriptionId = 'featured-business-001'; // This would come from auth context
  
  // Find the current subscription details
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  
  // Debug logging
  console.log('Subscriptions data:', subscriptions);
  console.log('Current subscription:', currentSubscription);
  console.log('Subscriptions loading:', isLoading);
  console.log('Subscriptions error:', error);
  
  // Check if subscription includes Products or Services features
  const hasProductsFeature = currentSubscription?.features.some(feature => 
    feature.toLowerCase().includes('product')) || false;
  const hasServicesFeature = currentSubscription?.features.some(feature => 
    feature.toLowerCase().includes('service')) || false;

  console.log('Has Products Feature:', hasProductsFeature);
  console.log('Has Services Feature:', hasServicesFeature);
  console.log('Current subscription features:', currentSubscription?.features);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
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
      enabled: hasProductsFeature
    },
    {
      label: 'Services',
      icon: Wrench,
      href: '/dashboard/services',
      enabled: hasServicesFeature
    },
    {
      label: 'Authorized Users',
      icon: Users,
      href: '/dashboard/authorized-users',
      enabled: true
    },
    {
      label: 'Subscription',
      icon: Crown,
      href: '/dashboard/subscription',
      enabled: true
    },
    {
      label: 'Payment',
      icon: CreditCard,
      href: '/dashboard/payment',
      enabled: true
    },
    {
      label: 'Upgrade',
      icon: Receipt,
      href: '/dashboard/upgrade',
      enabled: true
    }
  ];

  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = location.pathname === item.href;
    
    if (!item.enabled) {
      return (
        <div className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1",
          "text-gray-400 cursor-not-allowed opacity-50"
        )}>
          <item.icon className="mr-3 h-5 w-5" />
          {item.label}
        </div>
      );
    }
    
    return (
      <Link to={item.href} onClick={() => onClose()}>
        <div className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors",
          isActive 
            ? "bg-blue-100 text-blue-700" 
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
          <span className="text-lg font-semibold">Dashboard Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <MenuItem key={item.href} item={item} />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;
