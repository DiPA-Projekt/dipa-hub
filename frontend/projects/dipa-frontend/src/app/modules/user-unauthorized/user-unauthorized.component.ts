import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-user-unauthorized',
  templateUrl: './user-unauthorized.component.html',
  styleUrls: ['./user-unauthorized.component.scss'],
})
export class UserUnauthorizedComponent implements OnInit {
  public userName: string;
  public constructor(private authenticationService: AuthenticationService) {}

  public ngOnInit(): void {
    this.authenticationService.getUserData().subscribe((user) => {
      if (user !== null) {
        this.userName = user.name;
      } else {
        this.authenticationService.login();
      }
    });
  }

  public logOut(): void {
    this.authenticationService.logout();
  }
}
