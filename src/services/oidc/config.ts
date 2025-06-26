
import { getAuthConfig } from '@/config/auth';

export const createOIDCConfig = () => {
  return getAuthConfig();
};

export const getDiscoveryUrls = (authority: string): string[] => {
  return [
    `${authority}/.well-known/openid_configuration`,
    `${authority}/.well-known/openid-configuration`, 
    `${authority}/.well-known/openid_connect_configuration`,
    `${authority}/oauth2/.well-known/openid_configuration`,
    `${authority}/.well-known/oauth-authorization-server`
  ];
};
