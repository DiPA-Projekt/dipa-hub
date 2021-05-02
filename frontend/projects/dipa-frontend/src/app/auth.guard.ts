import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { forkJoin, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Timeline, TimelinesService, User, UserService } from 'dipa-api-client';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  protected authenticated: boolean;
  protected organisationRoles: string[];
  protected projects: number[];
  protected timelines: Timeline[];
  protected currentUser: User;

  public constructor(
    private oauthService: OAuthService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private timelineServie: TimelinesService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return new Promise(async (resolve, reject) => {
      try {
        this.authenticated = this.authenticationService.isLoggedIn();
        this.organisationRoles = this.authenticationService.getOrganisationRoles().map((r) => r.abbreviation);
        this.projects = this.authenticationService.getProjectRoles().map((r) => r.projectId);

        this.authenticationService.getUserData().subscribe((data) => (this.currentUser = data));
        this.timelineServie.getTimelines().subscribe((data) => (this.timelines = data));

        const result = await this.isAccessAllowed(route);
        resolve(result);
      } catch (error) {
        reject(`An error happened during access validation. Details:${error}`);
      }
    });
  }

  public canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }

  public async isAccessAllowed(route: ActivatedRouteSnapshot): Promise<boolean> {
    if (!this.authenticated) {
      await this.authenticationService.login();
    }

    let accessOrganisationRole: boolean;
    let accessProject: boolean;

    const requiredOrganisationRoles = route.data.organisationRoles as string[];
    if (!(requiredOrganisationRoles instanceof Array) || requiredOrganisationRoles.length === 0) {
      accessOrganisationRole = false;
    } else {
      accessOrganisationRole = requiredOrganisationRoles.every((role) => this.organisationRoles.includes(role));
    }

    const requiredProjectId = route.params.id as number;
    if (!requiredProjectId) {
      accessProject = true;
    } else if (this.projects.includes(Number(requiredProjectId))) {
      accessProject = true;
    } else {
      accessProject = this.timelines
        .filter((t: Timeline) => t.projectOwner.id === this.currentUser.id)
        .map((t) => t.id)
        .includes(Number(requiredProjectId));
    }

    return accessOrganisationRole || accessProject;
  }
}
