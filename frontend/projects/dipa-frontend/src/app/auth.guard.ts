import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { UserService } from 'dipa-api-client';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  protected authenticated: boolean;
  protected roles: string[];
  protected projects: number[];

  constructor(
    private oauthService: OAuthService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return new Promise(async (resolve, reject) => {
      try {
        this.authenticated = this.authenticationService.isLoggedIn();
        this.roles = this.authenticationService.getUserRoles();
        this.projects = this.authenticationService.getProjects();

        const result = await this.isAccessAllowed(route);
        resolve(result);
      } catch (error) {
        reject(`An error happened during access validation. Details:${error}`);
      }
    });
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }

  public async isAccessAllowed(route: ActivatedRouteSnapshot): Promise<boolean> {
    if (!this.authenticated) {
      await this.authenticationService.login();
    }

    let accessRole;
    let accessProject;

    const requiredRoles = route.data.roles as string[];
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      accessRole = true;
    } else {
      accessRole = requiredRoles.every((role) => this.roles.includes(role));
    }

    const requiredProjectId = route.params.id as number;
    if (!requiredProjectId) {
      accessProject = true;
    } else {
      accessProject = this.projects.includes(Number(requiredProjectId));
    }

    return accessRole && accessProject;
  }
}
