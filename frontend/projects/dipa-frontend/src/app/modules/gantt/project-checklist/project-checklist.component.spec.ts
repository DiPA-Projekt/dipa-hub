import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChecklistComponent } from './project-checklist.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavMenuListItemComponent } from '../../../shared/nav-menu-list-item/nav-menu-list-item.component';
import { MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { NavService } from '../../../nav.service';
import { MatIcon } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProjectChecklistComponent', () => {
  let component: ProjectChecklistComponent;
  let fixture: ComponentFixture<ProjectChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProjectChecklistComponent,
        SidenavComponent,
        NavMenuListItemComponent,
        MatNavList,
        MatSidenavContent,
        MatSidenavContainer,
        MatSidenav,
        MatIcon,
        NavMenuListItemComponent,
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [NavService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
