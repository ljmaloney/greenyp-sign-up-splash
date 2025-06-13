
import { UserManagerSettings } from 'oidc-client-ts';

const getAuthConfig = (): UserManagerSettings => {
  const isDevelopment = window.location.hostname === 'localhost';
  
  // Use the current origin for the app, not the auth server
  const baseUrl = window.location.origin;
  
  // FusionAuth typically uses the tenant ID in the URL or a specific issuer format
  // Try different authority formats for FusionAuth
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
    loadUserInfo: false, // Keep disabled until CORS is configured
    // FusionAuth specific configuration
    client_authentication: 'client_secret_post',
    // Add extra query params to help with debugging
    extraQueryParams: {},
    // Explicitly set metadata URLs for FusionAuth
    metadata: {
      // FusionAuth discovery document might be at a different path
      issuer: authority,
      authorization_endpoint: `${authority}/oauth2/authorize`,
      token_endpoint: `${authority}/oauth2/token`,
      userinfo_endpoint: `${authority}/oauth2/userinfo`,
      end_session_endpoint: `${authority}/oauth2/logout`,
      jwks_uri: `${authority}/.well-known/jwks`,
      // Add revocation endpoint
      revocation_endpoint: `${authority}/oauth2/revoke`
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

  console.log('OIDC Config for FusionAuth:', {
    authority: config.authority,
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
    has_client_secret: !!clientSecret,
    client_authentication: config.client_authentication,
    loadUserInfo: config.loadUserInfo,
    origin: baseUrl,
    wellKnownUrl: `${authority}/.well-known/openid_configuration`,
    alternativeWellKnownUrls: [
      `${authority}/.well-known/openid-configuration`,
      `${authority}/.well-known/openid_connect_configuration`,
      `${authority}/oauth2/.well-known/openid_configuration`
    ],
    explicitMetadata: config.metadata
  });

  return config;
};

export { getAuthConfig };
