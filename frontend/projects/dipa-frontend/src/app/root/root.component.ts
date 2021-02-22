import { Component, OnInit } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root-component',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(private oauthService: OAuthService) {  }

  public logout() {
    this.oauthService.logOut();
  }

}
