import {TestBed} from '@angular/core/testing';

import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {GanttMenuComponent} from './menus/gantt-menu/gantt-menu.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MaterialModule} from './material/material.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        GanttMenuComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSidenavModule,
        MaterialModule
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
  });

  it(`should have as title 'dipa-frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app.title).toEqual('dipa-frontend');
  });

});
