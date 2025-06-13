
interface AuthConfig {
  issuer: string;
  clientId: string;
  redirectUri: string;
  scope: string;
}

const getAuthConfig = (): AuthConfig => {
  const isDevelopment = window.location.hostname === 'localhost';
  
  return {
    issuer: isDevelopment ? 'http://localhost:9011' : 'https://auth.greenyp.com',
    clientId: process.env.VITE_OIDC_CLIENT_ID || 'greenyp-client',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid profile email'
  };
};

export { getAuthConfig };
export type { AuthConfig };
