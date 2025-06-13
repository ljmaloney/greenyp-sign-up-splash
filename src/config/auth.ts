
import { UserManagerSettings } from 'oidc-client-ts';

const getAuthConfig = (): UserManagerSettings => {
  const isDevelopment = window.location.hostname === 'localhost';
  
  return {
    authority: isDevelopment ? 'http://localhost:9011' : 'https://auth.greenyp.com',
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID || 'greenyp-client',
    redirect_uri: `${window.location.origin}/auth/callback`,
    post_logout_redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'openid profile email',
    automaticSilentRenew: true,
    silent_redirect_uri: `${window.location.origin}/auth/silent-callback`,
    filterProtocolClaims: true,
    loadUserInfo: true,
  };
};

export { getAuthConfig };
