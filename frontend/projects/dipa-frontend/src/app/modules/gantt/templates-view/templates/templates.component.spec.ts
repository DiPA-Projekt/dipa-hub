import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TemplatesComponent} from './templates.component';

import {MatNavList } from '@angular/material/list';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatSidenavModule} from '@angular/material/sidenav';


describe('TemplatesComponent', () => {
  let component: TemplatesComponent;
  let fixture: ComponentFixture<TemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatesComponent, MatNavList ],
      imports: [HttpClientTestingModule, MatSidenavModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
