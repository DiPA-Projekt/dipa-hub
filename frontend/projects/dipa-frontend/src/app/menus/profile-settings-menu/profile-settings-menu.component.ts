import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { AuthenticationService } from '../../authentication.service';
import { User } from 'dipa-api-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-settings-menu',
  templateUrl: './profile-settings-menu.component.html',
  styleUrls: ['./profile-settings-menu.component.scss'],
  exportAs: 'profileSettingsMenu',
})
export class ProfileSettingsMenuComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenu, { static: true }) menu: MatMenu;

  userData: User;

  userDataSubscription: Subscription;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.userDataSubscription = this.authenticationService.getUserData().subscribe((data) => {
      this.userData = data;
    });
  }

  ngOnDestroy(): void {
    this.userDataSubscription?.unsubscribe();
  }

  public logout(): void {
    this.authenticationService.logout();
  }
}
