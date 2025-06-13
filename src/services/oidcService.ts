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

    // Add error event handler
    this.userManager.events.addAccessTokenExpiring(() => {
      console.log('Access token expiring');
    });
  }

  async login(): Promise<void> {
    try {
      console.log('Starting OIDC login...');
      
      const settings = this.userManager.settings;
      console.log('OIDC Settings:', {
        authority: settings.authority,
        client_id: settings.client_id,
        redirect_uri: settings.redirect_uri
      });

      // Test multiple possible FusionAuth discovery document URLs
      const possibleUrls = [
        `${settings.authority}/.well-known/openid_configuration`,
        `${settings.authority}/.well-known/openid-configuration`, 
        `${settings.authority}/.well-known/openid_connect_configuration`,
        `${settings.authority}/oauth2/.well-known/openid_configuration`,
        `${settings.authority}/.well-known/oauth-authorization-server`
      ];

      console.log('Testing FusionAuth discovery document URLs...');
      let discoveryDoc = null;
      let workingUrl = null;

      for (const url of possibleUrls) {
        try {
          console.log(`Trying: ${url}`);
          const response = await fetch(url);
          if (response.ok) {
            discoveryDoc = await response.json();
            workingUrl = url;
            console.log(`✅ Found discovery document at: ${url}`, discoveryDoc);
            break;
          } else {
            console.log(`❌ ${url} returned ${response.status} ${response.statusText}`);
          }
        } catch (fetchError) {
          console.log(`❌ ${url} failed with network error:`, fetchError);
        }
      }

      if (!discoveryDoc) {
        console.error('❌ No FusionAuth discovery document found at any expected URL');
        console.log('🔍 Debugging suggestions:');
        console.log('1. Check if FusionAuth is fully started (try accessing http://localhost:9011/admin)');
        console.log('2. Verify the application is configured with OpenID Connect enabled');
        console.log('3. Check if a tenant is configured and might affect the URL structure');
        console.log('4. Verify the application issuer matches the authority URL');
        
        throw new Error(`FusionAuth discovery document not found. Tried ${possibleUrls.length} URLs. Please check FusionAuth configuration.`);
      }

      if (!discoveryDoc.authorization_endpoint) {
        console.error('Discovery document missing authorization_endpoint:', discoveryDoc);
        throw new Error('FusionAuth discovery document is incomplete - missing authorization_endpoint');
      }

      console.log('✅ FusionAuth discovery successful, proceeding with login...');
      await this.userManager.signinRedirect();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async handleCallback(): Promise<User> {
    try {
      console.log('Handling OIDC callback...');
      console.log('Current URL:', window.location.href);
      console.log('URL search params:', window.location.search);
      
      const user = await this.userManager.signinRedirectCallback();
      console.log('Callback successful, user:', user);
      return user;
    } catch (error) {
      console.error('Callback handling failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  async handleSilentCallback(): Promise<void> {
    try {
      console.log('Handling silent callback...');
      await this.userManager.signinSilentCallback();
      console.log('Silent callback completed successfully');
    } catch (error) {
      console.error('Silent callback failed:', error);
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
      const user = await this.userManager.getUser();
      console.log('Retrieved user:', user ? 'User found' : 'No user');
      return user;
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
