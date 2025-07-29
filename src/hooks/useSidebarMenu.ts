
import { 
  LayoutDashboard,
  MapPin,
  Users,
  Package,
  Wrench,
  CreditCard,
  Crown,
  Image,
  FileText
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/contexts/AuthContext';
import { useAccountData } from '@/hooks/useAccountData';

export const useSidebarMenu = () => {
  const { user } = useAuth();
  const { data: subscriptions, isLoading, error } = useSubscriptions();
  const { data: accountData } = useAccountData();

  // Get current subscription ID from account data
  const currentSubscriptionId = accountData?.producer?.subscriptions?.[0]?.subscriptionId;
  
  // Find the current subscription details
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  
  // Debug logging
  console.log('Subscriptions data:', subscriptions);
  console.log('Current subscription ID from account:', currentSubscriptionId);
  console.log('Current subscription:', currentSubscription);
  console.log('Subscriptions loading:', isLoading);
  console.log('Subscriptions error:', error);
  console.log('Account data:', accountData);
  console.log('Producer ID:', accountData?.producer?.producerId);
  
  // Check if subscription includes Products, Services, or Photo Gallery features using the feature property
  const hasProductsFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'products') || false;
  const hasServicesFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'services') || false;
  const hasPhotoGalleryFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'gallery') || false;

  console.log('Has Products Feature:', hasProductsFeature);
  console.log('Has Services Feature:', hasServicesFeature);
  console.log('Has Photo Gallery Feature:', hasPhotoGalleryFeature);
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
      upgradeHref: '/dashboard/subscription',
      isPremium: true
    },
    {
      label: 'Services',
      icon: Wrench,
      href: producerId ? `/dashboard/services?producerId=${producerId}` : '/dashboard/services',
      enabled: hasServicesFeature,
      upgradeHref: '/dashboard/subscription',
      isPremium: true
    },
    {
      label: 'Photo Gallery',
      icon: Image,
      href: producerId ? `/dashboard/photo-gallery?producerId=${producerId}` : '/dashboard/photo-gallery',
      enabled: hasPhotoGalleryFeature,
      upgradeHref: '/dashboard/subscription',
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
      label: 'Invoices',
      icon: FileText,
      href: producerId ? `/dashboard/invoices?producerId=${producerId}` : '/dashboard/invoices',
      enabled: true
    }
  ];

  return { menuItems };
};
