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
} from 'dipa-api-client';
import { MatSelectChange } from '@angular/material/select';
import ProjectTypeEnum = Timeline.ProjectTypeEnum;

@Component({
  selector: 'app-chart-header',
  templateUrl: './chart-header.component.html',
  styleUrls: ['./chart-header.component.scss'],
})
export class ChartHeaderComponent implements OnInit, OnDestroy {
  @Input() timelineData: Timeline;
  @Input() active;
  @Input() showTitle;
  @Input() projectApproachModifiable;
  @Input() showActions;
  @Output() projectTypeChanged = new EventEmitter();
  @Output() operationTypeChanged = new EventEmitter();
  @Output() projectApproachChanged = new EventEmitter();

  timelinesSubscription: Subscription;
  operationTypesSubscription: Subscription;
  projectApproachesSubscription: Subscription;

  projectTypesList: Array<ProjectTypeEnum> = [ProjectTypeEnum.InternesProjekt, ProjectTypeEnum.AnProjekt];
  operationTypesList: Array<OperationType> = [];
  projectApproachesList: Array<ProjectApproach> = [];

  constructor(
    private timelinesService: TimelinesService,
    private projectService: ProjectService,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService
  ) {}

  ngOnInit(): void {
    this.operationTypesSubscription = this.operationTypesService.getOperationTypes().subscribe((data) => {
      this.operationTypesList = data;
    });

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches().subscribe((data) => {
      this.projectApproachesList = data;
    });
  }

  ngOnDestroy(): void {
    this.timelinesSubscription?.unsubscribe();
    this.projectApproachesSubscription?.unsubscribe();
    this.operationTypesSubscription?.unsubscribe();
  }

  changeProjectApproach(event: MatSelectChange): void {
    this.timelineData.projectApproachId = parseInt(event.value, 10);

    this.timelinesService.updateTimeline(this.timelineData.id, this.timelineData).subscribe(() => {
      this.projectApproachChanged.emit(event.value);
    });
  }

  changeOperationType(event: MatSelectChange): void {
    this.timelineData.operationTypeId = parseInt(event.value, 10);
    this.operationTypeChanged.emit(event.value);
  }

  changeProjectType(event: MatSelectChange): void {
    this.timelineData.projectType = event.value as ProjectTypeEnum;

    this.timelinesService.updateTimeline(this.timelineData.id, this.timelineData).subscribe(() => {
      this.projectTypeChanged.emit(event.value);
    });
  }

  filterProjectApproaches(operationTypeId: number): any[] {
    return this.projectApproachesList.filter((projectApproach) => projectApproach.operationTypeId === operationTypeId);
  }

  getIcsCalendarFile(): void {
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
}
