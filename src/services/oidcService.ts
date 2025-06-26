
import { User } from 'oidc-client-ts';
import { OIDCUserManager } from './oidc/userManager';
import { OIDCAuthFlow } from './oidc/authFlow';
import { OIDCUserTransformer } from './oidc/userTransformer';
import { UserInfo } from './oidc/types';

class OIDCService {
  private userManager: OIDCUserManager;
  private authFlow: OIDCAuthFlow;
  private userTransformer: OIDCUserTransformer;

  constructor() {
    this.userManager = new OIDCUserManager();
    this.authFlow = new OIDCAuthFlow(this.userManager);
    this.userTransformer = new OIDCUserTransformer();
  }

  async login(): Promise<void> {
    return this.authFlow.login();
  }

  async handleCallback(): Promise<User> {
    return this.authFlow.handleCallback();
  }

  async handleSilentCallback(): Promise<void> {
    return this.authFlow.handleSilentCallback();
  }

  async logout(): Promise<void> {
    return this.authFlow.logout();
  }

  async getUser(): Promise<User | null> {
    return this.userManager.getUser();
  }

  async removeUser(): Promise<void> {
    return this.userManager.removeUser();
  }

  async silentRenew(): Promise<User | null> {
    return this.userManager.silentRenew();
  }

  // Helper method to transform OIDC user to our User format
  transformUser(oidcUser: User): UserInfo {
    return this.userTransformer.transformUser(oidcUser);
  }
}

export const oidcService = new OIDCService();
export type { UserInfo };
