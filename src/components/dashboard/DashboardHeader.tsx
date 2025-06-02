
import React from 'react';
import { Button } from "@/components/ui/button";
import { Leaf, Menu, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden mr-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link to="/dashboard" className="flex items-center">
            <Leaf className="h-8 w-8 text-greenyp-600 mr-2" />
            <span className="text-xl font-bold text-greenyp-700">GreenYP Dashboard</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Welcome back!</span>
          </div>
          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
