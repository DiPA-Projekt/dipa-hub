import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttComponent } from './gantt.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { NavMenuListItemComponent } from '../../shared/nav-menu-list-item/nav-menu-list-item.component';
import { NavService } from '../../nav.service';

describe('GanttComponent', () => {
  let component: GanttComponent;
  let fixture: ComponentFixture<GanttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GanttComponent, SidenavComponent, MatNavList, MatIcon, NavMenuListItemComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatMenuModule,
        MaterialModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
      providers: [NavService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
});
