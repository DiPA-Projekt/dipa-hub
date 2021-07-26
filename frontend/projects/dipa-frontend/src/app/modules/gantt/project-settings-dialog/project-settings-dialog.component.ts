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
  PropertyQuestion,
  TimelinesService,
} from 'dipa-api-client';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../../authentication.service';
import { TimelineDataService } from '../../../shared/timelineDataService';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import ProjectTypeEnum = Project.ProjectTypeEnum;
import { MatListOption } from '@angular/material/list';

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

  public propertyQuestions: PropertyQuestion[] = [];

  public operationTypeId: number;

  public userData: User;
  public allUsers: User[];
  public formGroupProjectData: FormGroup;
  public formGroupTimelineData: FormGroup;

  public userHasProjectEditRights = false;
  public isNotEditable = true;

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

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: Project; timeline: Timeline },
    public dialogRef: MatDialogRef<ProjectSettingsDialogComponent>,
    private authenticationService: AuthenticationService,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService,
    private timelinesService: TimelinesService,
    private projectService: ProjectService,
    private userService: UserService,
    private timelineDataService: TimelineDataService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  public ngOnInit(): void {
    this.operationTypeId = this.data.timeline.operationTypeId;
    this.setReactiveForm(this.data.project, this.data.timeline);

    this.authenticationService.getUserData().subscribe((data) => {
      this.userData = data;
    });

    this.dataSubscription = forkJoin([
      this.userService.getUsers(),
      this.operationTypesService.getOperationTypes(),
      this.projectApproachesService.getProjectApproaches(),
      this.projectService.getProjectPropertyQuestions(this.data.project.id),
    ]).subscribe(([allUsers, operationTypesList, projectApproachesList, propertyQuestions]) => {
      this.allUsers = allUsers;
      this.operationTypesList = operationTypesList;
      this.projectApproachesList = projectApproachesList;
      this.propertyQuestions = propertyQuestions;
    });
  }
  public ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
    this.createProjectSubscription?.unsubscribe();
  }

  public onSubmitProjectData(form: FormGroup): void {
    this.projectService.updateProjectData(this.data.timeline.id, form.value).subscribe({
      next: () => {
        form.reset(form.value);
        // in the future should be emitted only if projectSize field changes
        // this.projectSizeChanged.emit();
        this.timelineDataService.setTimelines();
        this.timelineDataService.setProjectData(this.data.timeline.id);
      },
      error: null,
      complete: () => void 0,
    });
  }

  public onSubmitTimelineData(form: FormGroup): void {
    // this.timelineData.projectType = event.value as ProjectTypeEnum;

    this.timelinesService.updateTimeline(this.data.timeline.id, form.value).subscribe({
      next: () => {
        form.reset(form.value);
        // in the future should be emitted only if projectSize field changes
        // this.projectSizeChanged.emit();
        this.timelineDataService.setTimelines();
      },
      error: null,
      complete: () => void 0,
    });
  }

  public displayProjectSize(size: string): string {
    return this.sizes.find((x: ProjectSize) => x.value === size)?.display;
  }

  public filterProjectApproaches(operationTypeId: number): Array<ProjectApproach> {
    return this.projectApproachesList.filter((projectApproach) => projectApproach.operationTypeId === operationTypeId);
  }

  public archiveProject(): void {
    this.data.project.archived = true;

    this.projectService.updateProjectData(this.data.timeline.id, this.data.project).subscribe({
      next: () => {
        this.dialogRef.close();
        this.timelineDataService.setTimelines();
        this.router.navigate([`overview/archivedProjects`], {
          fragment: `gantt${this.data.timeline.id}`,
        });
      },
      error: null,
      complete: () => void 0,
    });
  }

  public activateProject(): void {
    this.data.project.archived = false;

    this.projectService.updateProjectData(this.data.timeline.id, this.data.project).subscribe({
      next: () => {
        this.dialogRef.close();
        this.timelineDataService.setTimelines();
      },
      error: null,
      complete: () => void 0,
    });
  }

  public onCloseClick(): void {
    this.dialogRef.close();
  }

  public selectionChange(event: MatListOption): void {
    const matListOptionElement = event[0] as MatListOption;
    const propertiesQuestionElement = matListOptionElement.value as PropertyQuestion;
    propertiesQuestionElement.selected = matListOptionElement.selected;
    this.projectService
      .updateProjectPropertyQuestion(this.data.timeline.id, propertiesQuestionElement)
      .subscribe((d) => {
        this.timelineDataService.setNonPermanentProjectTasks(this.data.timeline.id);
        this.timelineDataService.setPermanentProjectTasks(this.data.timeline.id);
      });
  }

  private setReactiveForm(project: Project, timeline: Timeline): void {
    this.authenticationService.getProjectRoles().then((roles) => {
      this.userHasProjectEditRights =
        !project?.archived &&
        roles.filter((d) => d.projectId === timeline.id && (d.abbreviation === 'PL' || d.abbreviation === 'PE'))
          .length > 0;
      this.isNotEditable = project.archived || !this.userHasProjectEditRights;

      this.formGroupProjectData = this.fb.group({
        id: new FormControl({ value: project?.id, disabled: !this.userHasProjectEditRights }),
        name: new FormControl(
          { value: project?.name, disabled: !this.userHasProjectEditRights },
          { validators: [Validators.required] }
        ),
        projectOwner: null,
        akz: new FormControl({ value: project?.akz, disabled: this.isNotEditable }),
        projectSize: new FormControl({
          value: project?.projectSize,
          disabled: this.isNotEditable,
        }),
        client: new FormControl({
          value: project?.client,
          disabled: this.isNotEditable,
        }),
        department: new FormControl({
          value: project?.department,
          disabled: this.isNotEditable,
        }),
        archived: [project?.archived],
      });
      this.formGroupTimelineData = this.fb.group({
        archived: new FormControl({ value: timeline.archived, disabled: !this.userHasProjectEditRights }),
        id: new FormControl({ value: timeline?.id, disabled: !this.userHasProjectEditRights }),
        start: new FormControl({ value: timeline.start, disabled: !this.userHasProjectEditRights }),
        end: new FormControl({ value: timeline.end, disabled: !this.userHasProjectEditRights }),
        increment: new FormControl({ value: timeline.increment, disabled: !this.userHasProjectEditRights }),
        defaultTimeline: new FormControl({ value: timeline.defaultTimeline, disabled: !this.userHasProjectEditRights }),
        name: new FormControl(
          { value: project?.name, disabled: !this.userHasProjectEditRights },
          { validators: [Validators.required] }
        ),
        operationTypeId: new FormControl(
          { value: this.data.timeline.operationTypeId, disabled: this.isNotEditable },
          {
            validators: [Validators.required],
          }
        ),
        projectApproachId: new FormControl(
          { value: timeline.projectApproachId, disabled: this.isNotEditable },
          {
            validators: [Validators.required],
          }
        ),
        projectType: new FormControl(
          { value: timeline.projectType, disabled: this.isNotEditable },
          {
            validators: [Validators.required],
          }
        ),
      });
    });

    this.formGroupProjectData = this.fb.group({
      id: new FormControl({ value: project?.id, disabled: true }),
      akz: new FormControl({ value: project?.akz, disabled: true }),
      name: new FormControl({ value: project?.name, disabled: true }),
      projectSize: new FormControl({ value: project?.projectSize }),
      client: new FormControl({ value: project?.client, disabled: true }),
      department: new FormControl({ value: project?.department, disabled: true }),
      archived: [project?.archived],
    });

    this.formGroupTimelineData = this.fb.group({
      archived: new FormControl({ value: timeline.archived, disabled: true }),
      start: new FormControl({ value: timeline.start, disabled: true }),
      end: new FormControl({ value: timeline.end, disabled: true }),
      increment: new FormControl({ value: timeline.increment, disabled: true }),
      defaultTimeline: new FormControl({ value: timeline.defaultTimeline, disabled: true }),
      operationTypeId: new FormControl({ value: timeline.operationTypeId }),
      projectApproachId: new FormControl({ value: timeline.projectApproachId }),
      projectType: new FormControl({ value: timeline.projectType }),
    });
  }
}
