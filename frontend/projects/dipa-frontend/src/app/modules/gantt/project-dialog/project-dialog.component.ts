import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../authentication.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import {
  OperationType,
  OperationTypesService,
  ProjectApproachesService,
  ProjectApproach,
  ProjectService,
  Timeline,
  User,
  UserService,
} from 'dipa-api-client';
import ProjectTypeEnum = Timeline.ProjectTypeEnum;
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { TimelineDataService } from '../../../shared/timelineDataService';

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

  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  public constructor(
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService,
    private projectService: ProjectService,
    private userService: UserService,
    private timelineDataService: TimelineDataService,
    private fb: FormBuilder,
    private router: Router
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
            this.timelineDataService.setTimeline();
            this.openSnackBar(newTimeline);
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

  public onCloseClick(): void {
    this.dialogRef.close();
  }

  private filterProjectOwner(projectOwnerId: number): User {
    return this.allUsers.find((user) => user.id === projectOwnerId);
  }

  private openSnackBar(newTimeline: Timeline): void {
    const snackBarRef = this.snackBar.open(`Das Projekt ${newTimeline.name} wurde erstellt.`, 'Zu dem Projekt', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 4000,
      panelClass: ['panel'],
    });
    snackBarRef.onAction().subscribe(() => {
      this.router.navigate([`/gantt/${newTimeline.id}/project-checklist/quickstart`]);
    });
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
      start: this.startDate,
      end: this.endDate,
      projectSize: 'SMALL',
      projectOwner: this.userData.id,
    });
  }
}
