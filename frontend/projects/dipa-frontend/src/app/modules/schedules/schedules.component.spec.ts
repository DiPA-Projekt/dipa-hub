import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesComponent } from './schedules.component';
import { MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { NavMenuListItemComponent } from '../../shared/nav-menu-list-item/nav-menu-list-item.component';
import { MatNavList } from '@angular/material/list';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavService } from '../../nav.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIcon } from '@angular/material/icon';

describe('SchedulesComponent', () => {
  let component: SchedulesComponent;
  let fixture: ComponentFixture<SchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SchedulesComponent,
        MatSidenavContainer,
        MatSidenav,
        MatSidenavContent,
        NavMenuListItemComponent,
        MatNavList,
        MatIcon,
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, MatSidenavModule, BrowserAnimationsModule],
      providers: [NavService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
