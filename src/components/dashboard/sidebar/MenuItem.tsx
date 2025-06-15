
import React from 'react';
import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItemData {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  enabled: boolean;
  upgradeHref?: string;
  isPremium?: boolean;
}

interface MenuItemProps {
  item: MenuItemData;
  isActive: boolean;
  onClose: () => void;
}

const MenuItem = ({ item, isActive, onClose }: MenuItemProps) => {
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

export default MenuItem;
