
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
import { useAuth } from '@/contexts/AuthContext';
import { useAccountData } from '@/hooks/useAccountData';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const { data: subscriptions, isLoading, error } = useSubscriptions();
  const { data: accountData } = useAccountData(user?.id || null);

  // Mock current user's subscription ID - in a real app, this would come from user context
  const currentSubscriptionId = 'basic-listing-001'; // This would come from auth context
  
  // Find the current subscription details
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  
  // Debug logging
  console.log('Subscriptions data:', subscriptions);
  console.log('Current subscription:', currentSubscription);
  console.log('Subscriptions loading:', isLoading);
  console.log('Subscriptions error:', error);
  console.log('Account data:', accountData);
  console.log('Producer ID:', accountData?.producer?.producerId);
  
  // Check if subscription includes Products or Services features
  const hasProductsFeature = currentSubscription?.features.some(feature => 
    feature.toLowerCase().includes('product')) || false;
  const hasServicesFeature = currentSubscription?.features.some(feature => 
    feature.toLowerCase().includes('service')) || false;

  console.log('Has Products Feature:', hasProductsFeature);
  console.log('Has Services Feature:', hasServicesFeature);
  console.log('Current subscription features:', currentSubscription?.features);

  // Get the producerId from account data
  const producerId = accountData?.producer?.producerId;

  const menuItems = [
    {
      label: 'Business Profile',
      icon: LayoutDashboard,
      href: '/dashboard',
      enabled: true
    },
    {
      label: 'Locations',
      icon: MapPin,
      href: producerId ? `/dashboard/locations?producerId=${producerId}` : '/dashboard/locations',
      enabled: true
    },
    {
      label: 'Contacts',
      icon: Users,
      href: producerId ? `/dashboard/contacts?producerId=${producerId}` : '/dashboard/contacts',
      enabled: true
    },
    {
      label: 'Authorized Users',
      icon: Users,
      href: producerId ? `/dashboard/authorized-users?producerId=${producerId}` : '/dashboard/authorized-users',
      enabled: true
    },
    {
      label: 'Products',
      icon: Package,
      href: producerId ? `/dashboard/products?producerId=${producerId}` : '/dashboard/products',
      enabled: hasProductsFeature,
      upgradeHref: '/dashboard/upgrade',
      isPremium: true
    },
    {
      label: 'Services',
      icon: Wrench,
      href: producerId ? `/dashboard/services?producerId=${producerId}` : '/dashboard/services',
      enabled: hasServicesFeature,
      upgradeHref: '/dashboard/upgrade',
      isPremium: true
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
    const isActive = location.pathname === item.href.split('?')[0]; // Compare base path without query params
    
    if (!item.enabled) {
      return (
        <Link to={item.upgradeHref || '/dashboard/upgrade'} onClick={() => onClose()}>
          <div className={cn(
            "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors",
            "text-gray-400 cursor-pointer opacity-50 hover:bg-gray-50"
          )}>
            <div className="flex items-center">
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </div>
            {item.isPremium && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </div>
        </Link>
      );
    }
    
    return (
      <Link to={item.href} onClick={() => onClose()}>
        <div className={cn(
          "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors",
          isActive 
            ? "bg-blue-100 text-blue-700" 
            : "text-gray-700 hover:bg-gray-100"
        )}>
          <div className="flex items-center">
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </div>
          {item.isPremium && (
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
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
