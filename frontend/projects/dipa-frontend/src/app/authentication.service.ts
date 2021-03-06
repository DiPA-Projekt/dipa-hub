import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { User, UserService, ProjectRole } from 'dipa-api-client';
import { environment } from '../environments/environment';
import { OrganisationRole } from 'projects/dipa-api-client/src/model/organisationRole';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private authenticated = false;
  private authorized = false;

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

  public isAuthorized(): boolean {
    return this.authorized;
  }

  public getOrganisationRoles(): OrganisationRole[] {
    const user: User = this.userData.getValue();
    return user && typeof user.organisationRoles !== 'undefined' ? user.organisationRoles : [];
  }

  public getProjectRolesAfterLoggedIn(): ProjectRole[] {
    const user: User = this.userData.getValue();
    return user && typeof user.projectRoles !== 'undefined' ? user.projectRoles : [];
  }

  public async getProjectRoles(): Promise<ProjectRole[]> {
    await this.loadUserProfile();
    const user: User = this.userData.getValue();
    return user && typeof user.projectRoles !== 'undefined' ? user.projectRoles : [];
  }

  public isUserInOrganisationRoles(userRole: string): boolean {
    const roles = this.getOrganisationRoles().map((r) => r.abbreviation);
    return roles.indexOf(userRole) !== -1;
  }

  public async login(): Promise<boolean> {
    return this.oAuthService.loadDiscoveryDocumentAndLogin().then(async (loggedIn) => {
      await this.loadUserProfile();
      this.authenticated = true;
      return loggedIn;
    });
  }

  public logout(): void {
    this.oAuthService.logOut();

    this.authenticated = false;
    this.authorized = false;
    this.userData.next(null);
  }

  public loadUserProfile() {
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser().subscribe({
        next: (data: User) => {
          this.userData.next(data);
          this.authorized = true;
          resolve(true);
        },
        error: (err) => {
          if (err.status === 401) {
            this.authorized = false;
            this.userData.next(err.error);
          }
          resolve(false);
        },
        complete: () => void 0,
      });
    });
  }
}
