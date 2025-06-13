
import { UserManagerSettings } from 'oidc-client-ts';

const getAuthConfig = (): UserManagerSettings => {
  const isDevelopment = window.location.hostname === 'localhost';
  
  // Use the current origin for the app, not the auth server
  const baseUrl = window.location.origin;
  
  const config: UserManagerSettings = {
    authority: isDevelopment ? 'http://localhost:9011' : 'https://auth.greenyp.com',
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID || 'greenyp-client',
    redirect_uri: `${baseUrl}/auth/callback`,
    post_logout_redirect_uri: baseUrl,
    response_type: 'code',
    scope: 'openid profile email',
    automaticSilentRenew: true,
    silent_redirect_uri: `${baseUrl}/auth/silent-callback`,
    filterProtocolClaims: true,
    loadUserInfo: false, // Disable to avoid CORS issues
    // Add client authentication method for confidential clients
    client_authentication: 'client_secret_post'
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
    loadUserInfo: config.loadUserInfo
  });

  return config;
};

export { getAuthConfig };
