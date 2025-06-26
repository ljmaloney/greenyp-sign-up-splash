
import { UserManager, User } from 'oidc-client-ts';
import { createOIDCConfig } from './config';
import { OIDCEventHandlers } from './types';

export class OIDCUserManager {
  private userManager: UserManager;

  constructor() {
    const config = createOIDCConfig();
    this.userManager = new UserManager(config);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    const handlers: OIDCEventHandlers = {
      onUserLoaded: (user) => {
        console.log('🔔 User loaded event:', {
          sub: user.profile?.sub,
          email: user.profile?.email,
          expired: user.expired
        });
      },
      onUserUnloaded: () => {
        console.log('🔔 User unloaded event');
      },
      onAccessTokenExpired: () => {
        console.log('🔔 Access token expired event');
      },
      onAccessTokenExpiring: () => {
        console.log('🔔 Access token expiring event');
      }
    };

    this.userManager.events.addUserLoaded(handlers.onUserLoaded);
    this.userManager.events.addUserUnloaded(handlers.onUserUnloaded);
    this.userManager.events.addAccessTokenExpired(handlers.onAccessTokenExpired);
    this.userManager.events.addAccessTokenExpiring(handlers.onAccessTokenExpiring);
  }

  async getUser(): Promise<User | null> {
    try {
      const user = await this.userManager.getUser();
      console.log('👤 Get user result:', {
        hasUser: !!user,
        userValid: user && !user.expired,
        userDetails: user ? {
          sub: user.profile?.sub,
          email: user.profile?.email,
          expired: user.expired,
          expiresAt: user.expires_at,
          currentTime: Math.floor(Date.now() / 1000)
        } : 'no user'
      });
      return user;
    } catch (error) {
      console.error('❌ Get user failed:', error);
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

  getUserManager(): UserManager {
    return this.userManager;
  }
}
