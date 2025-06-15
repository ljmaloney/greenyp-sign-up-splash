
import React from 'react';
import { useLocation } from 'react-router-dom';
import MenuItem from './MenuItem';
import { useSidebarMenu } from '@/hooks/useSidebarMenu';

interface SidebarMenuProps {
  onClose: () => void;
}

const SidebarMenu = ({ onClose }: SidebarMenuProps) => {
  const location = useLocation();
  const { menuItems } = useSidebarMenu();

  return (
    <nav className="p-4 space-y-2">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.href.split('?')[0]; // Compare base path without query params
        return (
          <MenuItem 
            key={item.href} 
            item={item} 
            isActive={isActive}
            onClose={onClose}
          />
        );
      })}
    </nav>
  );
};

export default SidebarMenu;
