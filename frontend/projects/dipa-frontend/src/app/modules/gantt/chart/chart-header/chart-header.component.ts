import { Component, Input, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  OperationType,
  OperationTypesService,
  ProjectApproach,
  ProjectApproachesService,
  ProjectService,
  Timeline,
  TimelinesService,
  Project,
} from 'dipa-api-client';
import { MatSelectChange } from '@angular/material/select';
import ProjectTypeEnum = Timeline.ProjectTypeEnum;
import { AuthenticationService } from '../../../../authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProjectDialogComponent } from './delete-project-dialog/delete-project-dialog.component';
import { Router } from '@angular/router';
import { TimelineDataService } from '../../../../shared/timelineDataService';

@Component({
  selector: 'app-chart-header',
  templateUrl: './chart-header.component.html',
  styleUrls: ['./chart-header.component.scss'],
})
export class ChartHeaderComponent implements OnInit, OnDestroy {
  @Input() timelineData: Timeline;
  @Input() active: boolean;
  @Input() userHasProjectEditRights: boolean;
  @Input() showTitle: boolean;
  @Input() projectApproachModifiable: boolean;
  @Input() showActions: boolean;
  @Output() projectTypeChanged = new EventEmitter();
  @Output() operationTypeChanged = new EventEmitter();
  @Output() projectApproachChanged = new EventEmitter();
  @Output() projectDeleted = new EventEmitter();

  public isProjectOwner: boolean;
  public projectTypesList: Array<ProjectTypeEnum> = [ProjectTypeEnum.InternesProjekt, ProjectTypeEnum.AnProjekt];
  public operationTypesList: Array<OperationType> = [];
  public projectApproachesList: Array<ProjectApproach> = [];
  private timelinesSubscription: Subscription;
  private operationTypesSubscription: Subscription;
  private projectApproachesSubscription: Subscription;
  private projectSubscription: Subscription;
  private project: Project;

  public constructor(
    public dialog: MatDialog,
    private timelinesService: TimelinesService,
    private projectService: ProjectService,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService,
    private authenticationService: AuthenticationService,
    private timelineDataService: TimelineDataService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.operationTypesSubscription = this.operationTypesService.getOperationTypes().subscribe((data) => {
      this.operationTypesList = data;
    });

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches().subscribe((data) => {
      this.projectApproachesList = data;
    });

    void this.authenticationService.getProjectRoles().then((data) => {
      this.isProjectOwner =
        data.filter((d) => d.projectId === this.timelineData.id && d.abbreviation === 'PE').length > 0;
    });

    this.projectSubscription = this.projectService.getProjectData(this.timelineData.id).subscribe((data) => {
      this.project = data;
    });
  }

  public ngOnDestroy(): void {
    this.timelinesSubscription?.unsubscribe();
    this.projectApproachesSubscription?.unsubscribe();
    this.operationTypesSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
  }

  public changeProjectApproach(event: MatSelectChange): void {
    this.timelineData.projectApproachId = parseInt(event.value, 10);

    this.timelinesService.updateTimeline(this.timelineData.id, this.timelineData).subscribe(() => {
      this.projectApproachChanged.emit(event.value);
    });
  }

  public changeOperationType(event: MatSelectChange): void {
    this.timelineData.operationTypeId = parseInt(event.value, 10);
    this.operationTypeChanged.emit(event.value);
  }

  public changeProjectType(event: MatSelectChange): void {
    this.timelineData.projectType = event.value as ProjectTypeEnum;

    this.timelinesService.updateTimeline(this.timelineData.id, this.timelineData).subscribe(() => {
      this.projectTypeChanged.emit(event.value);
    });
  }

  public filterProjectApproaches(operationTypeId: number): any[] {
    return this.projectApproachesList.filter((projectApproach) => projectApproach.operationTypeId === operationTypeId);
  }

  public getIcsCalendarFile(): void {
    const filename = 'Meilensteine.ics';

    this.timelinesService.getTimelineCalendar(this.timelineData.id).subscribe((response: Blob) => {
      const dataType = response.type;
      const binaryData = [response];
      // use a temporary link with document-attribute for naming file
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      if (filename) {
        downloadLink.setAttribute('download', filename);
      }
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    });
  }

  public openDeleteProjectDialog(): void {
    const dialogRef = this.dialog.open(DeleteProjectDialogComponent, { data: this.timelineData });
    dialogRef.componentInstance.onDelete.subscribe((event) => {
      this.projectDeleted.emit(event);
    });
  }

  public activateProject(): void {
    this.project.archived = false;

    this.projectService.updateProjectData(this.timelineData.id, this.project).subscribe({
      next: () => {
        this.timelineDataService.setTimelines();
        this.router.navigate([`/gantt/${this.timelineData.id}/project-checklist/quickstart`]);
      },
      error: null,
      complete: () => void 0,
    });
  }
}
