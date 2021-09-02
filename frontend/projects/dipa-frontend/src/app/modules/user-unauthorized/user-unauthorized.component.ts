import { Component } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-user-unauthorized',
  templateUrl: './user-unauthorized.component.html',
  styleUrls: ['./user-unauthorized.component.scss'],
})
export class UserUnauthorizedComponent {
  public constructor(private authenticationService: AuthenticationService) {}

  public logOut(): void {
    this.authenticationService.logout();
  }
}
