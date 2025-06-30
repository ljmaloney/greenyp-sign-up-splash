
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
    
    let roles: string[] = Array.isArray(userRoles) ? userRoles : ['GreenPages-Subscriber'];
    
    // Normalize role names to handle case variations
    roles = roles.map(role => {
      const lowerRole = role.toLowerCase();
      
      console.log('🔄 TRANSFORMER - Processing role:', {
        originalRole: role,
        lowerCaseRole: lowerRole
      });
      
      // Map common variations to standard names
      if (lowerRole === 'greenpages-subscriber' || lowerRole === 'greepages-subscriber') {
        console.log('✅ TRANSFORMER - Mapped to GreenPages-Subscriber');
        return 'GreenPages-Subscriber';
      }
      if (lowerRole === 'greenpages-subscriberadmin' || lowerRole === 'greenpages-subscriberadmin') {
        console.log('✅ TRANSFORMER - Mapped to GreenPages-SubscriberAdmin');
        return 'GreenPages-SubscriberAdmin';
      }
      if (lowerRole === 'greenpages-admin' || lowerRole === 'greepages-admin') {
        console.log('✅ TRANSFORMER - Mapped to GreenPages-Admin');
        return 'GreenPages-Admin';
      }
      
      console.log('⚠️ TRANSFORMER - No mapping found, keeping original role');
      // Return the role as-is if no mapping found
      return role;
    });
    
    console.log('🔄 TRANSFORMER - Final role normalization result:', {
      originalRoles: userRoles,
      normalizedRoles: roles,
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
