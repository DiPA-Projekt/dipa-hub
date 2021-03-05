import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { NavMenuListItemComponent } from './shared/nav-menu-list-item/nav-menu-list-item.component';
import { MatNavList } from '@angular/material/list';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatSidenavContainer, MatSidenav, MatSidenavContent, NavMenuListItemComponent, MatNavList],
      imports: [HttpClientTestingModule, MatMenuModule, OAuthModule.forRoot()],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
