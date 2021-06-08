import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { User, UserService, ProjectRole, Timeline } from 'dipa-api-client';
import { environment } from '../environments/environment';
import { OrganisationRole } from 'projects/dipa-api-client/src/model/organisationRole';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private authenticated = false;

  private userData = new BehaviorSubject<User>(null);

  public constructor(private oAuthService: OAuthService, private userService: UserService) {
    this.oAuthService.configure(environment.keycloakConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
  }

  public getUserData(): Observable<User> {
    return this.userData;
  }

  public setUserData(userData: User): void {
    this.userData.next(userData);
  }

  public isLoggedIn(): boolean {
    return this.authenticated;
  }

  public getOrganisationRoles(): OrganisationRole[] {
    const user: User = this.userData.getValue();
    return user && typeof user.organisationRoles !== 'undefined' ? user.organisationRoles : [];
  }

  public getProjectRoles(): ProjectRole[] {
    const user: User = this.userData.getValue();
    return user && typeof user.projectRoles !== 'undefined' ? user.projectRoles : [];
  }

  public getCurrentUserProjectRoles(timeline: Timeline): string {
    const user: User = this.userData.getValue();
    const projectRolesString = [];

    const projectRoles = user.projectRoles.filter((role) => role.projectId === timeline.id);
    projectRoles.sort((a) => (a.permission === 'WRITE' ? -1 : 1));
    projectRoles.map((role) => role.abbreviation).forEach((role) => projectRolesString.push(role));
    return projectRolesString.join(', ');
  }

  public isUserInOrganisationRoles(userRole: string): boolean {
    const roles = this.getOrganisationRoles().map((r) => r.abbreviation);
    return roles.indexOf(userRole) !== -1;
  }

  public async login(): Promise<boolean> {
    return this.oAuthService.loadDiscoveryDocumentAndLogin().then(async (loggedIn) => {
      await this.loadUserProfile();
      if (this.userData.getValue() === null) {
        this.authenticated = false;
      } else {
        this.authenticated = true;
      }
      return loggedIn;
    });
  }

  public logout(): void {
    this.oAuthService.logOut();

    this.authenticated = false;
    this.userData.next(null);
  }

  private loadUserProfile() {
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser().subscribe(
        (data: User) => {
          this.userData.next(data);
          resolve(true);
        },
        (err) => {
          resolve(false);
        }
      );
    });
  }
}
