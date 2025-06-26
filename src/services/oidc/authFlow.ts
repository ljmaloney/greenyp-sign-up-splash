
import { User } from 'oidc-client-ts';
import { OIDCUserManager } from './userManager';
import { getDiscoveryUrls } from './config';

export class OIDCAuthFlow {
  constructor(private userManager: OIDCUserManager) {}

  async login(): Promise<void> {
    try {
      console.log('Starting OIDC login...');
      
      const settings = this.userManager.getUserManager().settings;
      console.log('OIDC Settings:', {
        authority: settings.authority,
        client_id: settings.client_id,
        redirect_uri: settings.redirect_uri
      });

      // Test multiple possible FusionAuth discovery document URLs
      const possibleUrls = getDiscoveryUrls(settings.authority);

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
      await this.userManager.getUserManager().signinRedirect();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async handleCallback(): Promise<User> {
    try {
      console.log('🔄 Handling OIDC callback...');
      console.log('📍 Current URL:', window.location.href);
      console.log('🔍 URL search params:', window.location.search);
      
      const user = await this.userManager.getUserManager().signinRedirectCallback();
      console.log('✅ Callback successful, user details:', {
        hasUser: !!user,
        sub: user?.profile?.sub,
        email: user?.profile?.email,
        name: user?.profile?.name,
        expired: user?.expired,
        expiresAt: user?.expires_at,
        currentTime: Math.floor(Date.now() / 1000),
        hasAccessToken: !!user?.access_token,
        hasIdToken: !!user?.id_token
      });
      
      // Verify the user is properly stored
      const storedUser = await this.userManager.getUser();
      console.log('🔍 User stored check:', {
        isStored: !!storedUser,
        matches: storedUser?.profile?.sub === user?.profile?.sub
      });
      
      return user;
    } catch (error) {
      console.error('❌ Callback handling failed:', error);
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
      await this.userManager.getUserManager().signinSilentCallback();
      console.log('Silent callback completed successfully');
    } catch (error) {
      console.error('Silent callback failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.userManager.getUserManager().signoutRedirect();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}
