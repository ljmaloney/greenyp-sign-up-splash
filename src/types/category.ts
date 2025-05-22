
import { LucideIcon } from 'lucide-react';

export interface Category {
  title: string;
  description: string;
  icon: string; // This will be the icon name from lucide-react
  details: string;
  slug: string;
}

// Change the interface to store the icon component reference instead of JSX
export interface CategoryWithIcon extends Category {
  iconComponent: LucideIcon; // This will store the icon component reference
}
