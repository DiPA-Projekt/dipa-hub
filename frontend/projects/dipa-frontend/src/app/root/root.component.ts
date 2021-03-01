import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root-component',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent {
  constructor(private oauthService: OAuthService) {}

  public logout(): void {
    this.oauthService.logOut();
  }
}
