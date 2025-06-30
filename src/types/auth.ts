
import { ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: () => void;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}
