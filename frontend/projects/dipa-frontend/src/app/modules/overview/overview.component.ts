import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';

import {MilestonesService, TasksService, TimelinesService,
  ProjectTypesService, ProjectApproachesService, IncrementsService} from 'dipa-api-client';
import { ChartComponent } from '../gantt/chart/chart.component';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  @ViewChildren('charts') charts: QueryList<ChartComponent>;

  timelinesSubscription: any;
  projectTypesSubscription: any;
  projectApproachesSubscription: any;

  timelineData: any;

  selectedTimelineId: number;
  selectedProjectTypeId: number;
  selectedProjectApproachId: number;

  vmAll$: Observable<any>;
  periodStartDateSubscription: any;

  observablesList: Array<any> = [];

  projectTypesList: Array<any> = [];
  projectApproachesList: Array<any> = [];
  loading: boolean;

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  constructor(private timelinesService: TimelinesService,
              private milestonesService: MilestonesService,
              private tasksService: TasksService,
              private projectTypesService: ProjectTypesService,
              private incrementsService: IncrementsService,
              private projectApproachesService: ProjectApproachesService) { }

  ngOnDestroy(): void {
    this.timelinesSubscription.unsubscribe();
    this.projectApproachesSubscription.unsubscribe();
    this.projectTypesSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.projectTypesSubscription = this.projectTypesService.getProjectTypes()
    .subscribe((data) => {
      this.projectTypesList = data;
    });

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches()
    .subscribe((data) => {
      this.projectApproachesList = data;
    });

    this.timelinesSubscription = this.timelinesService.getTimelines()
    .subscribe((data) => {
      this.timelineData = data;

      this.timelineData.forEach(timeline => {
        this.observablesList.push(this.setData(timeline.id));
      });

      this.vmAll$ = forkJoin(this.observablesList);

      this.selectedTimelineId = this.timelineData.find(c => c.defaultTimeline === true)?.id;
      this.selectedProjectTypeId = this.timelineData.find(item => item.id === this.selectedTimelineId).projectTypeId;
      this.selectedProjectApproachId = this.timelineData.find(item => item.id === this.selectedTimelineId).projectApproachId;

    });
  }

  setData(timelineId): Observable<any> {
    this.loading = true;

    return forkJoin([
      this.tasksService.getTasksForTimeline(timelineId),
      this.milestonesService.getMilestonesForTimeline(timelineId),
      this.incrementsService.getIncrementsForTimeline(timelineId)
    ])
    .pipe(
      map(([taskData, milestoneData, incrementsData]) => {
        this.loading = false;

        const timeline = this.timelineData.find(t => t.id === timelineId);
        const projectType = this.projectTypesList.find(type => type.id === timeline.projectTypeId);
        const projectApproach = this.projectApproachesList.find(approach => approach.id === timeline.projectApproachId);

        return {
          milestoneData,
          taskData,
          timeline,
          incrementsData,
          projectApproach,
          projectType
        };
      })
    );
  }

  createDateAtMidnight(date: any): Date {
    const dateAtMidnight = new Date(date);
    dateAtMidnight.setHours(0, 0, 0, 0);
    return dateAtMidnight;
  }

}
