
import { LucideIcon } from 'lucide-react';

// API response structure
export interface APICategory {
  lineOfBusinessId: string;
  lineOfBusinessName: string;
  shortDescription: string;
  description?: string;
  iconName: string;
}

// For display purposes with icon component
export interface CategoryWithIcon extends APICategory {
  iconComponent: LucideIcon;
  slug: string; // Generated from lineOfBusinessId for URL routing
  // Legacy fields for backward compatibility
  lobId?: string;
  categoryTitle?: string;
  categorySlug?: string;
  categoryDescription?: string;
  serviceCount?: number;
}

// Service structure for category pages - aligned with API response
export interface CategoryService {
  lobServiceId: string;
  lineOfBusinessId: string;
  createdByReference: string;
  createdByType: string;
  serviceName: string;
  serviceDescription: string;
  // Legacy fields for backward compatibility
  serviceId?: string;
}

// Legacy interface for backward compatibility
export interface Category {
  title: string;
  description: string;
  icon: string;
  details: string;
  slug: string;
}
