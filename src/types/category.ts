
import { LucideIcon } from 'lucide-react';

// API response structure
export interface APICategory {
  lineOfBusinessId: string;
  lineOfBusinessName: string;
  shortDescription: string;
  description?: string;
  iconName: string;
  iconFileName?: string | null;
  createDate: string;
  lastUpdateDate: string;
  createType: string;
  createByReference: string;
}

// For display purposes with icon component
export interface CategoryWithIcon extends APICategory {
  iconComponent: LucideIcon | null;
  slug: string; // Generated from lineOfBusinessId for URL routing
}

// Service structure for category pages - updated to match API response
export interface CategoryService {
  lobServiceId: string;
  lineOfBusinessId: string;
  createdByReference: string;
  createdByType: string;
  serviceName: string;
  serviceDescription: string;
}

// Legacy interface for backward compatibility
export interface Category {
  title: string;
  description: string;
  icon: string;
  details: string;
  slug: string;
}
