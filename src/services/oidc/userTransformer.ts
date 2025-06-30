
import { User } from 'oidc-client-ts';
import { UserInfo } from './types';

export class OIDCUserTransformer {
  // Helper method to transform OIDC user to our User format
  transformUser(oidcUser: User): UserInfo {
    console.log('🔍 TRANSFORMER - Full OIDC profile object:', oidcUser.profile);
    
    // Log all profile keys to debug where roles might be stored
    const profileKeys = Object.keys(oidcUser.profile);
    console.log('🔍 TRANSFORMER - All profile keys:', profileKeys);
    
    // Log all profile values to see the actual data structure
    profileKeys.forEach(key => {
      console.log(`🔍 TRANSFORMER - Profile[${key}]:`, oidcUser.profile[key]);
    });
    
    // Try multiple possible locations for roles in the profile
    const profileRoles = oidcUser.profile.roles;
    const profileRole = oidcUser.profile.role;
    const profileGroups = oidcUser.profile.groups;
    const profileAuthorities = oidcUser.profile.authorities;
    
    // Check for additional possible role field names that FusionAuth might use
    const profileRealmAccess = oidcUser.profile.realm_access;
    const profileResourceAccess = oidcUser.profile.resource_access;
    const profileApplicationRoles = oidcUser.profile.applicationRoles;
    const profileUserRoles = oidcUser.profile.userRoles;
    const profilePermissions = oidcUser.profile.permissions;
    
    console.log('🔍 TRANSFORMER - All possible role fields:', {
      roles: profileRoles,
      role: profileRole,
      groups: profileGroups,
      authorities: profileAuthorities,
      realm_access: profileRealmAccess,
      resource_access: profileResourceAccess,
      applicationRoles: profileApplicationRoles,
      userRoles: profileUserRoles,
      permissions: profilePermissions,
      allProfileKeys: profileKeys
    });
    
    // Determine which field contains the roles - check common FusionAuth patterns
    let rawRoles = profileRoles || profileRole || profileGroups || profileAuthorities || 
                   profileApplicationRoles || profileUserRoles || profilePermissions;
    
    // Handle Keycloak-style nested roles with proper type checking
    if (!rawRoles && profileRealmAccess && typeof profileRealmAccess === 'object' && profileRealmAccess !== null) {
      const realmAccess = profileRealmAccess as any;
      if (realmAccess.roles) {
        rawRoles = realmAccess.roles;
      }
    }
    
    // Handle resource-specific roles with proper type checking
    if (!rawRoles && profileResourceAccess && typeof profileResourceAccess === 'object' && profileResourceAccess !== null) {
      const resourceAccess = profileResourceAccess as Record<string, any>;
      // Look for roles in any resource
      for (const resource in resourceAccess) {
        if (resourceAccess[resource] && resourceAccess[resource].roles) {
          rawRoles = resourceAccess[resource].roles;
          break;
        }
      }
    }
    
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
