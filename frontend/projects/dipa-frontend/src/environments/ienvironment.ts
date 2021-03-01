import { AuthConfig } from 'angular-oauth2-oidc';

export interface IEnvironment {
  production: boolean;
  keycloakConfig: AuthConfig;
}
