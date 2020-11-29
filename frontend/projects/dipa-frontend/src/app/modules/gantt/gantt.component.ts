import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GanttControlsService} from './gantt-controls.service';
import {ChartComponent} from './chart/chart.component';
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
  viewTypeSelected: any;

  constructor(public ganttControlsService: GanttControlsService,
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
        const milestoneDates = milestoneData.map(x => this.createDateAtMidnight(x.date));
        const taskStartDates = taskData.map(x => this.createDateAtMidnight(x.start));
        const taskEndDates = taskData.map(x => this.createDateAtMidnight(x.end));

        const datesArray: Date[] = [...milestoneDates, ...taskStartDates, ...taskEndDates];

        const periodStartDate = GanttComponent.getMinimumDate(datesArray);
        const periodEndDate = GanttComponent.getMaximumDate(datesArray);

        console.log('periodStartDate: ' + periodStartDate);
        console.log('periodEndDate: ' + periodEndDate);

        const selectedTimeline = this.timelineData.find(c => c.id === this.selectedTimelineId);

        return {
          milestoneData,
          taskData,
          selectedTimeline,
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

  changeViewType(event): void {

    const toggle = event.source;

    if (toggle){
      const group = toggle.buttonToggleGroup;

      if (event.value.some(item => item === toggle.value)) {
        group.value = [toggle.value];
      }
      this.ganttControlsService.setViewType(group.value[0]);
    } else {
      this.ganttControlsService.setViewType(null);
    }
  }

  changeTimeline(event): void {
    this.setData();
    this.viewTypeSelected = undefined;
    this.ganttControlsService.setViewType(null);
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

  createDateAtMidnight(date: any): Date {
    const dateAtMidnight = new Date(date);
    dateAtMidnight.setHours(0, 0, 0, 0);
    return dateAtMidnight;
  }

}
