import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneDialogComponent } from './milestone-dialog.component';

describe('MilestoneDialogComponent', () => {
  let component: MilestoneDialogComponent;
  let fixture: ComponentFixture<MilestoneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilestoneDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
