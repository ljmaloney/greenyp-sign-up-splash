
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  ShieldCheck,
  Receipt,
  FileText
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const AdminSidebarComponent = () => {
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

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href;
                
                if (!item.enabled) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton disabled className="opacity-50 cursor-not-allowed">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebarComponent;
