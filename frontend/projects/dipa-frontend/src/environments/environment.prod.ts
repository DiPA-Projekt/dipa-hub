import { IEnvironment } from './ienvironment';

export const environment: IEnvironment = {
  production: true,
  keycloakConfig: {
    issuer: 'https://auth.dipa.online/auth/realms/DiPA',
    redirectUri: `${window.location.origin}/`,
    clientId: 'dipa-app',
    scope: 'openid profile email offline_access',
    responseType: 'code',
    // at_hash is not present in JWT token
    disableAtHashCheck: true,
    showDebugInformation: true,
  },
};
