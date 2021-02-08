import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttComponent } from './gantt.component';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatNavList } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';

describe('GanttComponent', () => {
  let component: GanttComponent;
  let fixture: ComponentFixture<GanttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GanttComponent, MatSidenav, MatSidenavContainer, SidenavComponent, MatSidenavContent, MatNavList],
      imports: [RouterTestingModule, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: '1',
            }),
          },
        },
      ],
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
