import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartComponent} from './chart.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatSidenavModule} from '@angular/material/sidenav';


describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartComponent ],
      imports: [ HttpClientTestingModule,
        MatSidenavModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
