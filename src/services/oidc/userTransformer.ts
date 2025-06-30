
import { User } from 'oidc-client-ts';
import { UserInfo } from './types';

export class OIDCUserTransformer {
  // Helper method to decode JWT token and extract claims
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('🔍 TRANSFORMER - Failed to decode JWT token:', error);
      return null;
    }
  }

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

    // NEW: Try to decode the access token to get claims directly
    let tokenClaims = null;
    if (oidcUser.access_token) {
      console.log('🔍 TRANSFORMER - Attempting to decode access token for claims...');
      tokenClaims = this.decodeJWT(oidcUser.access_token);
      if (tokenClaims) {
        console.log('🔍 TRANSFORMER - Decoded token claims:', tokenClaims);
        // Log all claim keys
        const claimKeys = Object.keys(tokenClaims);
        console.log('🔍 TRANSFORMER - All token claim keys:', claimKeys);
        
        // Log all claim values
        claimKeys.forEach(key => {
          console.log(`🔍 TRANSFORMER - TokenClaims[${key}]:`, tokenClaims[key]);
        });
      }
    }
    
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

    // NEW: Also check token claims for roles
    let tokenRoles = null;
    let tokenRole = null;
    let tokenGroups = null;
    let tokenAuthorities = null;
    let tokenApplicationRoles = null;
    let tokenUserRoles = null;
    let tokenPermissions = null;

    if (tokenClaims) {
      tokenRoles = tokenClaims.roles;
      tokenRole = tokenClaims.role;
      tokenGroups = tokenClaims.groups;
      tokenAuthorities = tokenClaims.authorities;
      tokenApplicationRoles = tokenClaims.applicationRoles;
      tokenUserRoles = tokenClaims.userRoles;
      tokenPermissions = tokenClaims.permissions;
    }
    
    console.log('🔍 TRANSFORMER - All possible role fields:', {
      // Profile fields
      profile_roles: profileRoles,
      profile_role: profileRole,
      profile_groups: profileGroups,
      profile_authorities: profileAuthorities,
      profile_realm_access: profileRealmAccess,
      profile_resource_access: profileResourceAccess,
      profile_applicationRoles: profileApplicationRoles,
      profile_userRoles: profileUserRoles,
      profile_permissions: profilePermissions,
      // Token claim fields
      token_roles: tokenRoles,
      token_role: tokenRole,
      token_groups: tokenGroups,
      token_authorities: tokenAuthorities,
      token_applicationRoles: tokenApplicationRoles,
      token_userRoles: tokenUserRoles,
      token_permissions: tokenPermissions,
      allProfileKeys: profileKeys,
      allTokenClaimKeys: tokenClaims ? Object.keys(tokenClaims) : 'no token claims'
    });
    
    // Determine which field contains the roles - check token claims first, then profile
    let rawRoles = tokenRoles || tokenRole || tokenGroups || tokenAuthorities || 
                   tokenApplicationRoles || tokenUserRoles || tokenPermissions ||
                   profileRoles || profileRole || profileGroups || profileAuthorities || 
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
      isArray: Array.isArray(rawRoles),
      source: tokenRoles ? 'token_claims' : profileRoles ? 'profile' : 'unknown'
    });
    
    // Ensure we always have an array of roles
    let roles: string[] = [];
    if (Array.isArray(rawRoles)) {
      roles = rawRoles;
    } else if (typeof rawRoles === 'string') {
      roles = [rawRoles];
    } else {
      console.log('⚠️ TRANSFORMER - No roles found in profile or token claims, using default subscriber role');
      // Default to subscriber role when no roles are found
      roles = ['GreenPages-Subscriber'];
    }
    
    console.log('🔄 TRANSFORMER - Final roles being set:', {
      originalRoles: rawRoles,
      finalRoles: roles,
      userEmail: oidcUser.profile.email,
      userSub: oidcUser.profile.sub,
      rolesSource: tokenRoles ? 'token_claims' : profileRoles ? 'profile' : 'default'
    });
    
    return {
      sub: oidcUser.profile.sub,
      email: oidcUser.profile.email || '',
      name: oidcUser.profile.name || '',
      roles: roles
    };
  }
}
