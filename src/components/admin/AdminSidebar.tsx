import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  ShieldCheck,
  Receipt,
  FileText,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      enabled: true
    },
    {
      label: 'Users',
      icon: Users,
      href: '/admin/users',
      enabled: true
    },
    {
      label: 'Subscribers',
      icon: UserCheck,
      href: '/admin/subscribers',
      enabled: true
    },
    {
      label: 'Classifieds',
      icon: FileText,
      href: '/admin/classifieds',
      enabled: true
    },
    {
      label: 'Invoices',
      icon: Receipt,
      href: '/admin/invoices',
      enabled: true
    },
    {
      label: 'Permissions',
      icon: ShieldCheck,
      href: '/admin/permissions',
      enabled: false
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/admin/settings',
      enabled: false
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
          <span className="text-lg font-semibold">Admin Menu</span>
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

export default AdminSidebar;
