import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';

import {
  IncrementsService,
  MilestonesService,
  OperationTypesService,
  ProjectApproachesService,
  TasksService,
  TimelinesService,
} from 'dipa-api-client';
import { ChartComponent } from '../../gantt/chart/chart.component';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @ViewChildren('charts') charts: QueryList<ChartComponent>;

  timelinesSubscription: any;
  operationTypesSubscription: any;
  projectApproachesSubscription: any;

  timelineData: any;

  vmAll$: Observable<any>;
  periodStartDateSubscription: any;

  observablesList: Array<any> = [];

  operationTypesList: Array<any> = [];
  projectApproachesList: Array<any> = [];
  loading: boolean;

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  constructor(
    private timelinesService: TimelinesService,
    private milestonesService: MilestonesService,
    private tasksService: TasksService,
    private operationTypesService: OperationTypesService,
    private incrementsService: IncrementsService,
    private projectApproachesService: ProjectApproachesService
  ) {}

  ngOnDestroy(): void {
    this.timelinesSubscription.unsubscribe();
    this.projectApproachesSubscription.unsubscribe();
    this.operationTypesSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.operationTypesSubscription = this.operationTypesService.getOperationTypes().subscribe((data) => {
      this.operationTypesList = data;
    });

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches().subscribe((data) => {
      this.projectApproachesList = data;
    });

    this.loadTimelines();
  }

  setData(timelineId): Observable<any> {
    this.loading = true;

    return forkJoin([
      this.tasksService.getTasksForTimeline(timelineId),
      this.milestonesService.getMilestonesForTimeline(timelineId),
      this.incrementsService.getIncrementsForTimeline(timelineId),
    ]).pipe(
      map(([taskData, milestoneData, incrementsData]) => {
        this.loading = false;

        const timeline = this.timelineData.find((t) => t.id === timelineId);
        const operationType = this.operationTypesList.find((type) => type.id === timeline.operationTypeId);
        const projectApproach = this.projectApproachesList.find(
          (approach) => approach.id === timeline.projectApproachId
        );
        return {
          milestoneData,
          taskData,
          timeline,
          incrementsData,
          projectApproach,
          operationType,
        };
      })
    );
  }

  createDateAtMidnight(date: any): Date {
    const dateAtMidnight = new Date(date);
    dateAtMidnight.setHours(0, 0, 0, 0);
    return dateAtMidnight;
  }

  changeProjectApproach(event, timelineId): void {
    const selectedTimeline = this.timelineData.find((item) => item.id === timelineId);
    selectedTimeline.projectApproachId = event.value;

    this.timelinesService.updateProject(selectedTimeline.id, selectedTimeline).subscribe((d) => {
      this.loadTimelines();
    });
  }

  changeOperationType(event, timelineId): void {
    this.timelineData.find((timeline) => timeline.id === timelineId).operationTypeId = event.value;
  }

  filterProjectApproaches(operationTypeId): any[] {
    return this.projectApproachesList.filter((projectApproach) => projectApproach.operationTypeId === operationTypeId);
  }

  loadTimelines(): void {
    this.observablesList = [];
    this.timelinesSubscription = this.timelinesService.getTimelines().subscribe((data) => {
      this.timelineData = data;

      this.timelineData.forEach((timeline) => {
        this.observablesList.push(this.setData(timeline.id));
      });

      this.vmAll$ = forkJoin(this.observablesList);
    });
  }
}
