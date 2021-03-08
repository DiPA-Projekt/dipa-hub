import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OAuthModule.forRoot()],
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
