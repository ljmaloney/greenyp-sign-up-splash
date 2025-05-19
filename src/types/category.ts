
import { LucideIcon } from 'lucide-react';

export interface Category {
  title: string;
  description: string;
  icon: string; // This will be the icon name from lucide-react
  details: string;
  slug: string;
}

export interface CategoryWithIcon extends Category {
  iconComponent: React.ReactNode;
}
