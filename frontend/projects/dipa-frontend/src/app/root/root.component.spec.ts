import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootComponent } from './root.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GanttMenuComponent } from '../menus/gantt-menu/gantt-menu.component';
import { MaterialModule } from '../material/material.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RootComponent, GanttMenuComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule, OAuthModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
