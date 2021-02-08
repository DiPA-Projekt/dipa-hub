import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewComponent } from './overview.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavMenuListItemComponent } from '../../shared/nav-menu-list-item/nav-menu-list-item.component';
import { NavService } from '../../nav.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIcon } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverviewComponent, NavMenuListItemComponent, MatIcon, MatNavList],
      imports: [HttpClientTestingModule, RouterTestingModule, MatSidenavModule, BrowserAnimationsModule],
      providers: [NavService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
