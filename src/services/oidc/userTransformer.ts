
import { User } from 'oidc-client-ts';
import { UserInfo } from './types';

export class OIDCUserTransformer {
  // Helper method to transform OIDC user to our User format
  transformUser(oidcUser: User): UserInfo {
    const userRoles = oidcUser.profile.roles;
    let roles: string[] = Array.isArray(userRoles) ? userRoles : ['GreenPages-Subscriber'];
    
    // Normalize role names to handle case variations
    roles = roles.map(role => {
      const lowerRole = role.toLowerCase();
      
      // Map common variations to standard names
      if (lowerRole === 'greenpages-subscriber' || lowerRole === 'greepages-subscriber') {
        return 'GreenPages-Subscriber';
      }
      if (lowerRole === 'greenpages-subscriberadmin' || lowerRole === 'greenpages-subscriberadmin') {
        return 'GreenPages-SubscriberAdmin';
      }
      if (lowerRole === 'greenpages-admin' || lowerRole === 'greepages-admin') {
        return 'GreenPages-Admin';
      }
      
      // Return the role as-is if no mapping found
      return role;
    });
    
    console.log('🔄 Role normalization:', {
      originalRoles: userRoles,
      normalizedRoles: roles
    });
    
    return {
      sub: oidcUser.profile.sub,
      email: oidcUser.profile.email || '',
      name: oidcUser.profile.name || '',
      roles: roles
    };
  }
}
