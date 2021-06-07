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
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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

  private operationTypesSubscription: Subscription;
  private usersSubscription: Subscription;
  private projectApproachesSubscription: Subscription;
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
    private fb: FormBuilder,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.authenticationService.getUserData().subscribe((data) => {
      this.userData = data;
    });

    this.usersSubscription = this.userService.getUsers().subscribe((data: User[]) => {
      this.allUsers = data;
    });

    this.operationTypesSubscription = this.operationTypesService.getOperationTypes().subscribe((data) => {
      this.operationTypesList = data;
    });

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches().subscribe((data) => {
      this.projectApproachesList = data;
    });

    this.setReactiveForm();
    this.inputNotation = false;
  }

  public ngOnDestroy(): void {
    this.operationTypesSubscription?.unsubscribe();
    this.usersSubscription?.unsubscribe();
    this.projectApproachesSubscription?.unsubscribe();
    this.createProjectSubscription?.unsubscribe();
  }

  public onSubmit(formGroup: FormGroup): void {
    if (formGroup.valid) {
      this.createProjectSubscription = this.projectService
        .createProject({
          project: formGroup.value,
          projectOwner: this.filterProjectOwner(formGroup.value.projectOwner),
        })
        .subscribe((newTimeline: Timeline) => {
          if (newTimeline) {
            let snackBarRef = this.snackBar.open(`Das Projekt ${newTimeline.name} wurde erstellt.`, 'click', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            snackBarRef.onAction().subscribe(() => {
              console.log(newTimeline.id);
              const id = newTimeline.id;
              console.log(this.router);
              this.router.navigate([`/gantt/${Number(id)}/project-checklist/quickstart`]);
            });
            // this.router.navigate([`/gantt/${newTimeline.id}/project-checklist`]).then(() => window.location.reload());
          }
          this.dialogRef.close();
        });
    } else {
      this.inputNotation = true;
    }
  }

  onclicK() {
    const id = 18;

    this.router.navigate([`/gantt/${id}/project-checklist/quickstart`]);
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

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  private setReactiveForm(): void {
    this.operationTypeId = this.itzBundSoftwareDevelopmentId;
    this.formGroup = this.fb.group(
      {
        id: -1,
        name: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
        operationTypeId: new FormControl(this.itzBundSoftwareDevelopmentId, {
          validators: [Validators.required],
          updateOn: 'blur',
        }),
        projectApproachId: new FormControl(this.itzBundSmallProjectApproachId, {
          validators: [Validators.required],
          updateOn: 'blur',
        }),
        projectType: new FormControl(ProjectTypeEnum.InternesProjekt, {
          validators: [Validators.required],
          updateOn: 'blur',
        }),
        start: new FormControl(this.startDate, { validators: [Validators.required], updateOn: 'blur' }),
        end: new FormControl(this.endDate, { validators: [Validators.required], updateOn: 'blur' }),
        projectSize: new FormControl('SMALL', { validators: [Validators.required], updateOn: 'blur' }),
        projectOwner: this.userData.id,
      },
      { updateOn: 'blur' }
    );
  }
}
