import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GanttControlsService} from './gantt-controls.service';
import {ChartComponent} from './chart/chart.component';
import {TimelineService} from './services/timeline.service'; // auf den "realistischeren" Service umschalten.
import {forkJoin, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {MilestonesService, TasksService, TimelinesService} from 'dipa-api-client';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit, OnDestroy {

  @ViewChild('ganttChart', { static: true }) chart: ChartComponent;

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  periodStartDateSubscription;
  periodEndDateSubscription;

  vm$: Observable<any>;

  timelineData = [];

  timelinesSubscription;

  selectedTimelineId: number;

  constructor(public ganttControlsService: GanttControlsService,
              private timelineService: TimelineService,

              private timelinesService: TimelinesService,
              private milestonesService: MilestonesService,
              private tasksService: TasksService) {  }

  static getMinimumDate(data: Date[]): Date {
    return data.reduce((acc, curr) => {
      return acc < curr ? acc : curr;
    });
  }

  static getMaximumDate(data: Date[]): Date {
    return data.reduce((acc, curr) => {
      return acc > curr ? acc : curr;
    });
  }

  ngOnInit(): void {

    this.timelinesSubscription = this.timelinesService.getTimelines()
    .subscribe((data) => {
      this.timelineData = data;
      this.selectedTimelineId = this.timelineData.find(c => c.defaultTimeline === true)?.id;
      this.setData();
    });

    this.periodStartDateSubscription = this.ganttControlsService.getPeriodStartDate()
    .subscribe((data) => {
      if (this.periodStartDate !== data) {
        this.periodStartDate = data;
      }
    });

    this.periodEndDateSubscription = this.ganttControlsService.getPeriodEndDate()
    .subscribe((data) => {
      if (this.periodEndDate !== data) {
        this.periodEndDate = data;
      }
    });
  }

  ngOnDestroy(): void {
    this.periodStartDateSubscription.unsubscribe();
    this.periodEndDateSubscription.unsubscribe();
  }

  setData(): void {
    this.vm$ = forkJoin([
      this.tasksService.getTasksForTimeline(this.selectedTimelineId),
      this.milestonesService.getMilestonesForTimeline(this.selectedTimelineId)
    ])
    .pipe(
      map(([taskData, milestoneData]) => {
        const milestoneDates = milestoneData.map(x => new Date(x.date));
        const taskStartDates = taskData.map(x => new Date(x.start));
        const taskEndDates = taskData.map(x => new Date(x.end));

        const datesArray: Date[] = [...milestoneDates, ...taskStartDates, ...taskEndDates];

        const periodStartDate = GanttComponent.getMinimumDate(datesArray);
        const periodEndDate = GanttComponent.getMaximumDate(datesArray);

        return {
          milestoneData,
          taskData,
          periodStartDate,
          periodEndDate
        };
      }),
      tap( data => {
        // this.periodEndDate = data.periodEndDate;
        // this.periodStartDate = data.periodStartDate;

        this.ganttControlsService.setPeriodStartDate(data.periodStartDate);
        this.ganttControlsService.setPeriodEndDate(data.periodEndDate);
      })
    );
  }

  changeTimeline(event): void {
    this.setData();
  }

  changeStartDate(change: string, $event: any): void {
    if ($event.value) {
      // this.periodStartDate = $event.value;
      this.ganttControlsService.setPeriodStartDate($event.value);
    }
  }

  changeEndDate(change: string, $event: any): void {
    if ($event.value) {
      // this.periodEndDate = $event.value;
      this.ganttControlsService.setPeriodEndDate($event.value);
    }
  }

}
