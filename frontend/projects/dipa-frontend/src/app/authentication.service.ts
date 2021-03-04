import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { User, UserService } from 'dipa-api-client';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  authenticated = false;

  userData = new BehaviorSubject<User>(null);

  constructor(private oAuthService: OAuthService, private userService: UserService) {
    this.oAuthService.configure(environment.keycloakConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
  }

  getUserData(): Observable<User> {
    return this.userData;
  }

  setUserData(userData: User): void {
    this.userData.next(userData);
  }

  isLoggedIn(): boolean {
    return this.authenticated;
  }

  getUserRoles(): string[] {
    const user: User = this.userData.getValue();
    return user && typeof user.roles !== 'undefined' ? user.roles : [];
  }

  isUserInRole(userRole: string): boolean {
    const roles = this.getUserRoles();
    return roles.indexOf(`ROLE_${userRole}`) !== -1;
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
    this.userData.next(null);
  }

  private loadUserProfile() {
    return new Promise((resolve, reject) => {
      this.userService.getUserData().subscribe(
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
