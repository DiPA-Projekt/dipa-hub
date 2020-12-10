import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

import {MilestonesService, TasksService, TimelinesService, 
  ProjectTypesService, ProjectApproachesService} from 'dipa-api-client';
import { ChartComponent } from '../gantt/chart/chart.component';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  @ViewChildren('charts') charts: QueryList<ChartComponent>;

  timelinesSubscription;
  projectTypesSubscription;
  projectApproachesSubscription;

  timelineData;

  selectedTimelineId: number;
  selectedProjectTypeId: number;
  selectedProjectApproachId: number;

  vmAll$: Observable<any>;
  periodStartDateSubscription: any;

  observablesList : Array<any> = [];
  resultList : [];
  
  projectTypesList: Array<any> = [];
  projectApproachesList: Array<any> = [];

  ngAfterViewInit() {
    console.log(this.charts);
  }

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  constructor(private timelinesService: TimelinesService,
              private milestonesService: MilestonesService,
              private tasksService: TasksService,
              private projectTypesService: ProjectTypesService,
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
      
      this.vmAll$.forEach(element => {
        // @ViewChild(element.timeline.id, { static: true });
        console.log(element)
      });

      this.selectedTimelineId = this.timelineData.find(c => c.defaultTimeline === true)?.id;
      this.selectedProjectTypeId = this.timelineData.filter(item => item.id === this.selectedTimelineId)[0].projectTypeId;
      this.selectedProjectApproachId = this.timelineData.filter(item => item.id === this.selectedTimelineId)[0].projectApproachId;

    });
    console.log(this.timelineData)
  }

  setData(timelineId): Observable<any> {
    return forkJoin([
      this.tasksService.getTasksForTimeline(timelineId),
      this.milestonesService.getMilestonesForTimeline(timelineId)
    ])
    .pipe(
      map(([taskData, milestoneData]) => {
        const milestoneDates = milestoneData.map(x => this.createDateAtMidnight(x.date));
        const taskStartDates = taskData.map(x => this.createDateAtMidnight(x.start));
        const taskEndDates = taskData.map(x => this.createDateAtMidnight(x.end));

        const datesArray: Date[] = [...milestoneDates, ...taskStartDates, ...taskEndDates];

        const timeline = this.timelineData.find(c => c.id === timelineId);
        const projectType = this.projectTypesList.filter(projectType => projectType.id === timeline.projectTypeId)[0];
        const projectApproach = this.projectApproachesList.filter(projectApproach => projectApproach.id === timeline.projectApproachId)[0];
        const periodStartDate = timeline.start;
        const periodEndDate = timeline.end;

        return {
          milestoneData,
          taskData,
          timeline,
          projectApproach,
          projectType,
          periodStartDate,
          periodEndDate
        };
      }),
      tap( data => {
        this.periodEndDate = data.periodEndDate;
        this.periodStartDate = data.periodStartDate;

        // this.ganttControlsService.setPeriodStartDate(data.periodStartDate);
        // this.ganttControlsService.setPeriodEndDate(data.periodEndDate);
      })
    );
  }

  createDateAtMidnight(date: any): Date {
    const dateAtMidnight = new Date(date);
    dateAtMidnight.setHours(0, 0, 0, 0);
    return dateAtMidnight;
  }

}
