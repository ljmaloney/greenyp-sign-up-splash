
import { UserManagerSettings } from 'oidc-client-ts';

const getAuthConfig = (): UserManagerSettings => {
  const isDevelopment = window.location.hostname === 'localhost';
  
  // Get the current origin (includes protocol, hostname, and port if not default)
  const currentOrigin = window.location.origin;
  
  return {
    authority: isDevelopment ? 'http://localhost:9011' : 'https://auth.greenyp.com',
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID || 'greenyp-client',
    redirect_uri: `${currentOrigin}/auth/callback`,
    post_logout_redirect_uri: currentOrigin,
    response_type: 'code',
    scope: 'openid profile email',
    automaticSilentRenew: true,
    silent_redirect_uri: `${currentOrigin}/auth/silent-callback`,
    filterProtocolClaims: true,
    loadUserInfo: true,
  };
};

export { getAuthConfig };
