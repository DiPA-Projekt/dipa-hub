import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMenuListItemComponent } from './nav-menu-list-item.component';
import { NavService } from '../../nav.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIcon } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NavMenuListItemComponent', () => {
  let component: NavMenuListItemComponent;
  let fixture: ComponentFixture<NavMenuListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavMenuListItemComponent, MatIcon],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [NavService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuListItemComponent);
    component = fixture.componentInstance;
    component.item = {
      name: 'Zeitplan',
      icon: 'event_note',
      url: 'gantt',
      isRoute: true,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
