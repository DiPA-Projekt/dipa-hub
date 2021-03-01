import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { from, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private authenticated$: Observable<boolean>;

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(environment.keycloakConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.authenticated$ = this.configure().pipe(shareReplay(1));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticated$;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }

  private configure(): Observable<boolean> {
    return from(this.oauthService.loadDiscoveryDocumentAndLogin());
  }
}
