import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GanttComponent} from './gantt.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatMenuModule} from '@angular/material/menu';
import {MaterialModule} from '../../material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';

describe('GanttComponent', () => {
  let component: GanttComponent;
  let fixture: ComponentFixture<GanttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanttComponent ],
      imports: [ RouterTestingModule,
        HttpClientTestingModule,
        MatMenuModule, MaterialModule,
        BrowserAnimationsModule, FormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // ERROR: 'Error during cleanup of component'
    expect(component).toBeTruthy();
  });
});
