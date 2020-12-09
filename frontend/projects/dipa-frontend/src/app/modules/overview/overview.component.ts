
import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AdresseService } from 'projects/dipa-api-client/src';

import {MilestonesService, TasksService, TimelinesService, 
  ProjectTypesService, ProjectApproachesService} from 'dipa-api-client';
import { ChartComponent } from '../gantt/chart/chart.component';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { GanttComponent } from '../gantt/gantt.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

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

  @ViewChildren('cmp') charts: QueryList<ChartComponent>;
  projectTypesList: import("dipa-api-client").ProjectType[];
  projectApproachesList: import("dipa-api-client").ProjectApproach[];

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
        console.log(timeline.id)

        this.observablesList.push(this.setData(timeline.id));

      });

      this.vmAll$ = forkJoin(this.observablesList);
      this.vmAll$.subscribe(e => console.log(e));
      
      this.vmAll$.forEach(element => {
        // @ViewChild(element.timeline.id, { static: true });
        console.log(element)
      });
      console.log(this.vmAll$);
      this.selectedTimelineId = this.timelineData.find(c => c.defaultTimeline === true)?.id;
      this.selectedProjectTypeId = this.timelineData.filter(item => item.id === this.selectedTimelineId)[0].projectTypeId;
      this.selectedProjectApproachId = this.timelineData.filter(item => item.id === this.selectedTimelineId)[0].projectApproachId;

    });
    
    // this.periodStartDateSubscription = this.ganttControlsService.getPeriodStartDate()
    // .subscribe((data) => {
    //   if (this.periodStartDate !== data) {
    //     this.periodStartDate = data;
    //   }
    // });

    // this.periodStartDateSubscription = this.ganttControlsService.getPeriodEndDate()
    // .subscribe((data) => {
    //   if (this.periodEndDate !== data) {
    //     this.periodEndDate = data;
    //   }
    // });
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

        return {
          milestoneData,
          taskData,
          timeline,
          projectApproach,
          projectType
          // periodStartDate,
          // periodEndDate
        };
      }),
      tap( data => {
        // this.periodEndDate = data.periodEndDate;
        // this.periodStartDate = data.periodStartDate;

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
