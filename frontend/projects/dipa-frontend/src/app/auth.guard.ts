import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {

  constructor(protected readonly router: Router, protected readonly keycloak: KeycloakService) {
    super(router, keycloak);
  }

  public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }
    const requiredRoles = route.data.roles as string[];
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }
    return requiredRoles.every((role) => this.roles.includes(role));
  }
}
