import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalStepperComponent } from './vertical-stepper.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatStep, MatStepHeader, MatVerticalStepper } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';

describe('VerticalStepperComponent', () => {
  let component: VerticalStepperComponent;
  let fixture: ComponentFixture<VerticalStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        VerticalStepperComponent,
        MatVerticalStepper,
        MatStepHeader,
        MatStep,
        MatIcon,
        MatLabel,
        MatFormField,
      ],
      imports: [BrowserAnimationsModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatRippleModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
