
import { getAuthConfig } from '@/config/auth';

interface TokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

interface UserInfo {
  sub: string;
  email: string;
  name: string;
  roles?: string[];
}

class OIDCService {
  private config = getAuthConfig();

  generateAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      state: this.generateState()
    });

    localStorage.setItem('oidc_state', params.get('state')!);
    return `${this.config.issuer}/oauth2/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, state: string): Promise<TokenResponse> {
    const storedState = localStorage.getItem('oidc_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    const response = await fetch(`${this.config.issuer}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        code,
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Token exchange failed');
    }

    const tokens = await response.json();
    localStorage.removeItem('oidc_state');
    return tokens;
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await fetch(`${this.config.issuer}/oauth2/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const tokens = this.getStoredTokens();
    if (tokens?.id_token) {
      const logoutUrl = `${this.config.issuer}/oauth2/logout?id_token_hint=${tokens.id_token}&post_logout_redirect_uri=${window.location.origin}`;
      window.location.href = logoutUrl;
    }
    this.clearStoredTokens();
  }

  storeTokens(tokens: TokenResponse): void {
    localStorage.setItem('oidc_tokens', JSON.stringify(tokens));
    localStorage.setItem('oidc_token_expiry', (Date.now() + tokens.expires_in * 1000).toString());
  }

  getStoredTokens(): TokenResponse | null {
    const tokens = localStorage.getItem('oidc_tokens');
    const expiry = localStorage.getItem('oidc_token_expiry');
    
    if (!tokens || !expiry) return null;
    
    if (Date.now() > parseInt(expiry)) {
      this.clearStoredTokens();
      return null;
    }
    
    return JSON.parse(tokens);
  }

  clearStoredTokens(): void {
    localStorage.removeItem('oidc_tokens');
    localStorage.removeItem('oidc_token_expiry');
    localStorage.removeItem('oidc_user');
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export const oidcService = new OIDCService();
export type { TokenResponse, UserInfo };
