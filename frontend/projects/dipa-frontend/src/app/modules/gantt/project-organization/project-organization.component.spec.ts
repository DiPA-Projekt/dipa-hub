import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOrganizationComponent } from './project-organization.component';

describe('ProjectOrganizationComponent', () => {
  let component: ProjectOrganizationComponent;
  let fixture: ComponentFixture<ProjectOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
