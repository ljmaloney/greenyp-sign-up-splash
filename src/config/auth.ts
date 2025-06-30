

import { UserManagerSettings } from 'oidc-client-ts';

const getAuthConfig = (): UserManagerSettings => {
  const isDevelopment = window.location.hostname === 'localhost';
  
  // Use the current origin for the app, not the auth server
  const baseUrl = window.location.origin;
  
  // For development, check if we have a local auth server running
  // Otherwise, use the production auth server
  const authority = isDevelopment 
    ? (localStorage.getItem('AUTH_HOST') || 'http://localhost:9011')
    : 'https://auth.greenyp.com';
  
  const config: UserManagerSettings = {
    authority: authority,
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID || 'greenyp-client',
    redirect_uri: `${baseUrl}/auth/callback`,
    post_logout_redirect_uri: baseUrl,
    response_type: 'code',
    scope: 'openid profile email',
    automaticSilentRenew: true,
    silent_redirect_uri: `${baseUrl}/auth/silent-callback`,
    filterProtocolClaims: true,
    loadUserInfo: false,
    // Add better error handling and timeout
    fetchRequestCredentials: 'same-origin',
    // FusionAuth specific configuration
    client_authentication: 'client_secret_post',
    // Add extra query params to help with debugging
    extraQueryParams: {},
  };

  // Add client secret if available (for confidential clients)
  const clientSecret = import.meta.env.VITE_OIDC_CLIENT_SECRET;
  if (clientSecret) {
    config.client_secret = clientSecret;
  } else {
    // For development, try to use a public client configuration
    config.client_authentication = undefined;
  }

  console.log('OIDC Config:', {
    authority: config.authority,
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
    has_client_secret: !!clientSecret,
    client_authentication: config.client_authentication,
    isDevelopment,
    origin: baseUrl
  });

  return config;
};

// Helper function to set custom auth host for development
export const setAuthHost = (host: string) => {
  const normalizedHost = host.startsWith('http') ? host : `https://${host}`;
  localStorage.setItem('AUTH_HOST', normalizedHost);
  // Force reload to apply new config
  window.location.reload();
};

// Helper function to reset auth host
export const resetAuthHost = () => {
  localStorage.removeItem('AUTH_HOST');
  window.location.reload();
};

export { getAuthConfig };

