
import { User } from 'oidc-client-ts';
import { UserInfo } from './types';

export class OIDCUserTransformer {
  // Helper method to transform OIDC user to our User format
  transformUser(oidcUser: User): UserInfo {
    const userRoles = oidcUser.profile.roles;
    
    console.log('🔍 TRANSFORMER - Raw roles from OIDC profile:', {
      rawRoles: userRoles,
      typeOfRoles: typeof userRoles,
      isArray: Array.isArray(userRoles)
    });
    
    // Ensure we always have an array of roles
    let roles: string[] = [];
    if (Array.isArray(userRoles)) {
      roles = userRoles;
    } else if (typeof userRoles === 'string') {
      roles = [userRoles];
    } else {
      roles = ['GreenPages-Subscriber']; // Default fallback
    }
    
    console.log('🔄 TRANSFORMER - Final roles being set:', {
      originalRoles: userRoles,
      finalRoles: roles,
      userEmail: oidcUser.profile.email,
      userSub: oidcUser.profile.sub
    });
    
    return {
      sub: oidcUser.profile.sub,
      email: oidcUser.profile.email || '',
      name: oidcUser.profile.name || '',
      roles: roles
    };
  }
}
