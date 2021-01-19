import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavMenuListItemComponent} from './nav-menu-list-item.component';

describe('NavMenuListItemComponent', () => {
  let component: NavMenuListItemComponent;
  let fixture: ComponentFixture<NavMenuListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavMenuListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
