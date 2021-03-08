import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-root-component',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent {
  constructor(private authenticationService: AuthenticationService) {}

  public isUserInRole(role: string): boolean {
    return this.authenticationService.isUserInRole(role);
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}
