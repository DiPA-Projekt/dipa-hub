import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavMenuListItemComponent} from './nav-menu-list-item.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {NavService} from '../../nav.service';
import {SidenavComponent} from '../../modules/gantt/sidenav/sidenav.component';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {MatIcon} from '@angular/material/icon';

describe('NavMenuListItemComponent', () => {
  let component: NavMenuListItemComponent;
  let fixture: ComponentFixture<NavMenuListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavMenuListItemComponent, MatIcon ],
      imports: [RouterTestingModule],
      providers: [NavService, RouterModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuListItemComponent);
    component = fixture.componentInstance;
    component.item = {
      name: 'Zeitplan',
      icon: 'event_note',
      route: 'gantt'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
