import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDataComponent } from './project-data.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavMenuListItemComponent } from '../../../shared/nav-menu-list-item/nav-menu-list-item.component';
import { MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { NavService } from '../../../nav.service';
import { MatIcon } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule, MatSelectTrigger } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

describe('ProjectDataComponent', () => {
  let component: ProjectDataComponent;
  let fixture: ComponentFixture<ProjectDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProjectDataComponent,
        SidenavComponent,
        NavMenuListItemComponent,
        MatNavList,
        MatSidenavContent,
        MatSidenavContainer,
        MatSidenav,
        MatIcon,
        MatLabel,
        MatFormField,
        MatLabel,
        MatSelectTrigger,
        NavMenuListItemComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
      ],
      providers: [
        NavService,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({
                id: '1',
              }),
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
