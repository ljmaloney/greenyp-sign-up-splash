
import { User } from 'oidc-client-ts';
import { UserInfo } from './types';

export class OIDCUserTransformer {
  // Helper method to transform OIDC user to our User format
  transformUser(oidcUser: User): UserInfo {
    console.log('🔍 TRANSFORMER - Full OIDC profile object:', oidcUser.profile);
    
    // Try multiple possible locations for roles in the profile
    const profileRoles = oidcUser.profile.roles;
    const profileRole = oidcUser.profile.role;
    const profileGroups = oidcUser.profile.groups;
    const profileAuthorities = oidcUser.profile.authorities;
    
    console.log('🔍 TRANSFORMER - All possible role fields:', {
      roles: profileRoles,
      role: profileRole,
      groups: profileGroups,
      authorities: profileAuthorities,
      allProfileKeys: Object.keys(oidcUser.profile)
    });
    
    // Determine which field contains the roles
    let rawRoles = profileRoles || profileRole || profileGroups || profileAuthorities;
    
    console.log('🔍 TRANSFORMER - Selected raw roles:', {
      rawRoles: rawRoles,
      typeOfRoles: typeof rawRoles,
      isArray: Array.isArray(rawRoles)
    });
    
    // Ensure we always have an array of roles
    let roles: string[] = [];
    if (Array.isArray(rawRoles)) {
      roles = rawRoles;
    } else if (typeof rawRoles === 'string') {
      roles = [rawRoles];
    } else {
      console.log('⚠️ TRANSFORMER - No roles found in profile, using default');
      roles = ['GreenPages-Subscriber']; // Default fallback
    }
    
    console.log('🔄 TRANSFORMER - Final roles being set:', {
      originalRoles: rawRoles,
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
