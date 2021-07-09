import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  OperationType,
  OperationTypesService,
  Project,
  ProjectApproach,
  ProjectApproachesService,
  ProjectService,
  Timeline,
  User,
  UserService,
} from 'dipa-api-client';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../../authentication.service';
import { TimelineDataService } from '../../../shared/timelineDataService';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import ProjectTypeEnum = Project.ProjectTypeEnum;

interface ProjectSize {
  value: string;
  display: string;
  description: string;
}

@Component({
  selector: 'app-project-settings-dialog',
  templateUrl: './project-settings-dialog.component.html',
  styleUrls: ['./project-settings-dialog.component.scss'],
})
export class ProjectSettingsDialogComponent implements OnInit, OnDestroy {
  public projectTypesList: Array<ProjectTypeEnum> = [ProjectTypeEnum.InternesProjekt, ProjectTypeEnum.AnProjekt];
  public operationTypesList: Array<OperationType> = [];
  public projectApproachesList: Array<ProjectApproach> = [];

  public typesOfShoes: string[] = [
    'Werden externe DL benötigt?',
    'Arbeitest du mit weiteren Projektteammitgliedern zusammen?',
  ];

  public operationTypeId: number;
  public startDate = new Date();
  public endDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
  public userData: User;
  public allUsers: User[];
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

  private dataSubscription: Subscription;
  private createProjectSubscription: Subscription;
  private itzBundSmallProjectApproachId = 7;
  private itzBundSoftwareDevelopmentId = 2;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: Project; timelineId: number },
    public dialogRef: MatDialogRef<ProjectSettingsDialogComponent>,
    private authenticationService: AuthenticationService,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService,
    private projectService: ProjectService,
    private userService: UserService,
    private timelineDataService: TimelineDataService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  public ngOnInit(): void {
    this.setReactiveForm();

    this.authenticationService.getUserData().subscribe((data) => {
      this.userData = data;
    });

    this.dataSubscription = forkJoin([
      this.userService.getUsers(),
      this.operationTypesService.getOperationTypes(),
      this.projectApproachesService.getProjectApproaches(),
    ]).subscribe(([allUsers, operationTypesList, projectApproachesList]) => {
      this.allUsers = allUsers;
      this.operationTypesList = operationTypesList;
      this.projectApproachesList = projectApproachesList;
      this.updateFormValues();
    });

    this.inputNotation = false;
  }
  public ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
    this.createProjectSubscription?.unsubscribe();
  }

  public onSubmit(formGroup: FormGroup): void {
    if (formGroup.valid) {
      this.createProjectSubscription = this.projectService
        .createProject({
          project: formGroup.value,
          projectOwner: this.filterProjectOwner(formGroup.value.projectOwner),
        })
        .subscribe({
          next: (newTimeline: Timeline) => {
            this.timelineDataService.setTimelines();
          },
          error: null,
          complete: () => {
            this.dialogRef.close();
          },
        });
    } else {
      this.inputNotation = true;
    }
  }

  public displayProjectSize(size: string): string {
    return this.sizes.find((x: ProjectSize) => x.value === size)?.display;
  }

  public filterProjectApproaches(operationTypeId: number): Array<ProjectApproach> {
    return this.projectApproachesList.filter((projectApproach) => projectApproach.operationTypeId === operationTypeId);
  }

  public archiveProject(): void {
    this.data.project.archived = true;

    this.projectService.updateProjectData(this.data.timelineId, this.data.project).subscribe({
      next: () => {
        this.dialogRef.close();
        this.timelineDataService.setTimelines();
        this.router.navigate([`overview/archivedProjects`], {
          fragment: `gantt${this.data.timelineId}`,
        });
      },
      error: null,
      complete: () => void 0,
    });
  }

  public onCloseClick(): void {
    this.dialogRef.close();
  }

  private filterProjectOwner(projectOwnerId: number): User {
    return this.allUsers.find((user) => user.id === projectOwnerId);
  }

  private setReactiveForm(): void {
    this.formGroup = this.fb.group(
      {
        id: null,
        name: new FormControl(null, { validators: [Validators.required], updateOn: 'blur' }),
        operationTypeId: new FormControl(null, {
          validators: [Validators.required],
          updateOn: 'blur',
        }),
        projectApproachId: new FormControl(null, {
          validators: [Validators.required],
          updateOn: 'blur',
        }),
        projectType: new FormControl(null, {
          validators: [Validators.required],
          updateOn: 'blur',
        }),
        start: new FormControl(null, { validators: [Validators.required], updateOn: 'blur' }),
        end: new FormControl(null, { validators: [Validators.required], updateOn: 'blur' }),
        projectSize: new FormControl(null, { validators: [Validators.required], updateOn: 'blur' }),
        projectOwner: null,
      },
      { updateOn: 'blur' }
    );
  }

  private updateFormValues(): void {
    this.operationTypeId = this.itzBundSoftwareDevelopmentId;

    this.formGroup.setValue({
      id: -1,
      name: '',
      operationTypeId: this.itzBundSoftwareDevelopmentId,
      projectApproachId: this.itzBundSmallProjectApproachId,
      projectType: ProjectTypeEnum.InternesProjekt,
      start: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
      end: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
      projectSize: 'SMALL',
      projectOwner: this.userData.id,
    });
  }
}
