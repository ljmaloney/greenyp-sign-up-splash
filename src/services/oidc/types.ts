
export interface UserInfo {
  sub: string;
  email: string;
  name: string;
  roles?: string[];
}

export interface OIDCEventHandlers {
  onUserLoaded: (user: any) => void;
  onUserUnloaded: () => void;
  onAccessTokenExpired: () => void;
  onAccessTokenExpiring: () => void;
}
