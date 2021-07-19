import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingsDialogComponent } from './project-settings-dialog.component';

describe('ProjectSettingsDialogComponent', () => {
  let component: ProjectSettingsDialogComponent;
  let fixture: ComponentFixture<ProjectSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectSettingsDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
