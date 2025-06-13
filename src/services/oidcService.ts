
import { UserManager, User, UserManagerSettings } from 'oidc-client-ts';
import { getAuthConfig } from '@/config/auth';

interface UserInfo {
  sub: string;
  email: string;
  name: string;
  roles?: string[];
}

class OIDCService {
  private userManager: UserManager;

  constructor() {
    const config = getAuthConfig();
    this.userManager = new UserManager(config);
    
    // Set up event handlers
    this.userManager.events.addUserLoaded((user) => {
      console.log('User loaded:', user);
    });
    
    this.userManager.events.addUserUnloaded(() => {
      console.log('User unloaded');
    });
    
    this.userManager.events.addAccessTokenExpired(() => {
      console.log('Access token expired');
    });
  }

  async login(): Promise<void> {
    try {
      await this.userManager.signinRedirect();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async handleCallback(): Promise<User> {
    try {
      const user = await this.userManager.signinRedirectCallback();
      return user;
    } catch (error) {
      console.error('Callback handling failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.userManager.signoutRedirect();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      return await this.userManager.getUser();
    } catch (error) {
      console.error('Get user failed:', error);
      return null;
    }
  }

  async removeUser(): Promise<void> {
    try {
      await this.userManager.removeUser();
    } catch (error) {
      console.error('Remove user failed:', error);
    }
  }

  async silentRenew(): Promise<User | null> {
    try {
      return await this.userManager.signinSilent();
    } catch (error) {
      console.error('Silent renew failed:', error);
      return null;
    }
  }

  // Helper method to transform OIDC user to our User format
  transformUser(oidcUser: User): UserInfo {
    const userRoles = oidcUser.profile.roles;
    const roles: string[] = Array.isArray(userRoles) ? userRoles : ['Greepages-Subscriber'];
    
    return {
      sub: oidcUser.profile.sub,
      email: oidcUser.profile.email || '',
      name: oidcUser.profile.name || '',
      roles: roles
    };
  }
}

export const oidcService = new OIDCService();
export type { UserInfo };
