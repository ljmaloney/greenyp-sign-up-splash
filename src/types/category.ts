
import { LucideIcon } from 'lucide-react';

// API response structure
export interface APICategory {
  lineOfBusinessId: string;
  lineOfBusinessName: string;
  urlLob: string; // SEO-friendly URL slug from API
  shortDescription: string;
  description?: string;
  iconName: string;
}

// For display purposes with icon component
export interface CategoryWithIcon extends APICategory {
  iconComponent: LucideIcon;
  // urlLob inherited from APICategory provides SEO-friendly URL routing
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
