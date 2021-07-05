import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUnauthorizedComponent } from './user-unauthorized.component';

describe('UserUnauthorizedComponent', () => {
  let component: UserUnauthorizedComponent;
  let fixture: ComponentFixture<UserUnauthorizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserUnauthorizedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
