import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { from, Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  private authenticated$: Observable<boolean>;

  constructor(private oauthService: OAuthService) { 
    this.oauthService.configure(this.authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.authenticated$ = this.configure().pipe(shareReplay(1));
  }

  
  private configure(): Observable<boolean> {
    return from(this.oauthService.loadDiscoveryDocumentAndLogin());
  }

  authConfig: AuthConfig = {
    issuer: 'https://auth.dipa.online/auth/realms/DiPA',
    redirectUri: window.location.origin + "/",
    clientId: 'dipa-app',
    scope: 'openid profile email offline_access',
    responseType: 'code',
    // at_hash is not present in JWT token
    disableAtHashCheck: true,
    showDebugInformation: true
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticated$;
  }

  
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute,state);
  }
  
}
