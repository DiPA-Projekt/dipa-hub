import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../authentication.service';
import { MatDialogRef } from '@angular/material/dialog';
import { OperationType, OperationTypesService, ProjectApproach, Timeline, User } from 'dipa-api-client';
import { ProjectApproachesService } from 'dipa-api-client';
import ProjectTypeEnum = Timeline.ProjectTypeEnum;
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from 'projects/dipa-api-client/src';
import { Router } from '@angular/router';

interface ProjectSize {
  value: string;
  display: string;
  description: string;
}

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDialogComponent implements OnInit, OnDestroy {
  public projectTypesList: Array<ProjectTypeEnum> = [ProjectTypeEnum.InternesProjekt, ProjectTypeEnum.AnProjekt];
  public operationTypesList: Array<OperationType> = [];
  public projectApproachesList: Array<ProjectApproach> = [];

  public operationTypeId: number;
  public startDate = new Date();
  public endDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
  public projectOwner: string;
  public userData: User;
  public formGroup: FormGroup;
  public inputNotation: boolean;

  public sizes: ProjectSize[] = [
    {
      value: 'SMALL',
      display: 'klein',
      description: 'Aufwand < 250 PT',
    },
    {
      value: 'MEDIUM',
      display: 'mittel',
      description: 'Aufwand 250 - 1.500 PT',
    },
    {
      value: 'BIG',
      display: 'groß',
      description: 'Aufwand > 1.500 PT',
    },
  ];

  private operationTypesSubscription: Subscription;
  private projectApproachesSubscription: Subscription;
  private createProjectSubscription: Subscription;

  public constructor(
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    private authenticationService: AuthenticationService,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService,
    private projectService: ProjectService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.authenticationService.getUserData().subscribe((data) => {
      this.userData = data;
    });

    this.operationTypesSubscription = this.operationTypesService.getOperationTypes().subscribe((data) => {
      this.operationTypesList = data;
    });

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches().subscribe((data) => {
      this.projectApproachesList = data;
    });

    this.setReactiveForm();
    // this.allFilled = false;
  }

  public ngOnDestroy(): void {
    this.operationTypesSubscription?.unsubscribe();
    this.projectApproachesSubscription?.unsubscribe();
    this.createProjectSubscription?.unsubscribe();
  }

  public onSubmit(formGroup: FormGroup): void {
    if (formGroup.valid) {
      console.log(formGroup.value);
      this.createProjectSubscription = this.projectService
        .createProject(formGroup.value)
        .subscribe((newTimeline: Timeline) => {
          if (newTimeline) {
            void this.router.navigate([`gantt/${newTimeline.id}/project-checklist`]);
            // .then(() => window.location.reload());
          }
          this.dialogRef.close();
        });
    } else {
      this.inputNotation = true;
    }
  }

  public displayProjectSize(size: string): string {
    return this.sizes.find((x: ProjectSize) => x.value === size)?.display;
  }

  public filterProjectApproaches(operationTypeId: number): any[] {
    return this.projectApproachesList.filter((projectApproach) => projectApproach.operationTypeId === operationTypeId);
  }

  public onCloseClick(): void {
    this.dialogRef.close();
  }

  private setReactiveForm(): void {
    this.formGroup = this.fb.group(
      {
        id: Math.floor(Math.random() * (1000000 - 10000000 + 1)) + 1000000,
        name: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
        operationTypeId: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
        projectApproachId: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
        projectType: new FormControl(ProjectTypeEnum.InternesProjekt, {
          validators: [Validators.required],
          updateOn: 'blur',
        }),
        start: new FormControl(this.startDate, { validators: [Validators.required], updateOn: 'blur' }),
        end: new FormControl(this.endDate, { validators: [Validators.required], updateOn: 'blur' }),
        projectSize: new FormControl('SMALL', { validators: [Validators.required], updateOn: 'blur' }),
        projectOwner: new FormControl(this.userData.name, { validators: [Validators.required], updateOn: 'blur' }),
      },
      { updateOn: 'blur' }
    );
  }
}
