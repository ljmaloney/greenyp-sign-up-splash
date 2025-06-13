
import { UserManagerSettings } from 'oidc-client-ts';

const getAuthConfig = (): UserManagerSettings => {
  const isDevelopment = window.location.hostname === 'localhost';
  
  // Use the current origin for the app, not the auth server
  const baseUrl = window.location.origin;
  
  // Ensure the authority URL doesn't have a trailing slash
  const authority = isDevelopment ? 'http://localhost:9011' : 'https://auth.greenyp.com';
  
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
    loadUserInfo: false, // Temporarily disable until CORS is configured
    // Add client authentication method for confidential clients
    client_authentication: 'client_secret_post',
    // Add extra query params to help with debugging
    extraQueryParams: {},
    // Increase timeout for metadata loading
    clockSkew: 300, // 5 minutes tolerance for clock skew
    // Add metadata URLs explicitly if discovery fails
    metadata: {
      // These will be automatically discovered from authority + .well-known/openid_configuration
      // But we can override if needed
    }
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
    loadUserInfo: config.loadUserInfo,
    origin: baseUrl,
    wellKnownUrl: `${authority}/.well-known/openid_configuration`
  });

  return config;
};

export { getAuthConfig };
