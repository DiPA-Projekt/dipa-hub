import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { GanttControlsService } from '../gantt-controls.service';
import {
  IncrementsService,
  MilestonesService,
  OperationType,
  ProjectApproach,
  TasksService,
  Timeline,
  TimelinesIncrementService,
  TimelinesService,
} from 'dipa-api-client';
import { ActivatedRoute, Params } from '@angular/router';
import { ChartComponent } from '../chart/chart.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnDestroy {
  @ViewChild('ganttChart', { static: true }) chart: ChartComponent;

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  periodStartDateSubscription: Subscription;
  periodEndDateSubscription: Subscription;

  vm$: Observable<any>;

  timelineData: Timeline[] = [];

  timelinesSubscription: Subscription;
  activatedRouteSubscription: Subscription;

  selectedTimelineId: number;

  viewTypeSelected: any;

  operationTypesList: OperationType[] = [];
  projectApproachesList: ProjectApproach[] = [];

  constructor(
    public ganttControlsService: GanttControlsService,
    private timelinesService: TimelinesService,
    private milestonesService: MilestonesService,
    private tasksService: TasksService,
    private timelinesIncrementService: TimelinesIncrementService,
    private incrementService: IncrementsService,
    public activatedRoute: ActivatedRoute
  ) {}

  static getMinimumDate(data: Date[]): Date {
    return data.reduce((acc, curr) => (acc < curr ? acc : curr));
  }

  static getMaximumDate(data: Date[]): Date {
    return data.reduce((acc, curr) => (acc > curr ? acc : curr));
  }

  ngOnInit(): void {
    this.timelinesSubscription = this.activatedRoute.parent.params
      .pipe(
        switchMap(
          (params: Params): Observable<Timeline[]> => {
            this.selectedTimelineId = parseInt(params.id, 10);
            return this.timelinesService.getTimelines();
          }
        )
      )
      .subscribe((data: Timeline[]) => {
        this.timelineData = data;

        this.setData();
      });

    this.periodStartDateSubscription = this.ganttControlsService.getPeriodStartDate().subscribe((data) => {
      if (this.periodStartDate !== data) {
        this.periodStartDate = data;
      }
    });

    this.periodEndDateSubscription = this.ganttControlsService.getPeriodEndDate().subscribe((data) => {
      if (this.periodEndDate !== data) {
        this.periodEndDate = data;
      }
    });
  }

  ngOnDestroy(): void {
    this.periodStartDateSubscription?.unsubscribe();
    this.periodEndDateSubscription?.unsubscribe();
  }

  setData(): void {
    this.vm$ = forkJoin([
      this.tasksService.getTasksForTimeline(this.selectedTimelineId),
      this.milestonesService.getMilestonesForTimeline(this.selectedTimelineId),
      this.incrementService.getIncrementsForTimeline(this.selectedTimelineId),
    ]).pipe(
      map(([taskData, milestoneData, incrementsData]) => {
        const milestoneDates = milestoneData.map((x) => this.createDateAtMidnight(x.date));
        const taskStartDates = taskData.map((x) => this.createDateAtMidnight(x.start));
        const taskEndDates = taskData.map((x) => this.createDateAtMidnight(x.end));

        const datesArray: Date[] = [...milestoneDates, ...taskStartDates, ...taskEndDates];

        const periodStartDate = TimelineComponent.getMinimumDate(datesArray);
        const periodEndDate = TimelineComponent.getMaximumDate(datesArray);

        const selectedTimeline = this.timelineData.find((c) => c.id === Number(this.selectedTimelineId));

        return {
          milestoneData,
          taskData,
          incrementsData,
          selectedTimeline,
          periodStartDate,
          periodEndDate,
        };
      }),
      tap((data: { periodStartDate: Date; periodEndDate: Date }) => {
        this.ganttControlsService.setPeriodStartDate(data.periodStartDate);
        this.ganttControlsService.setPeriodEndDate(data.periodEndDate);
      })
    );
  }

  changeViewType(event: MatButtonToggleChange): void {
    const toggle = event.source;

    if (toggle) {
      const group = toggle.buttonToggleGroup;

      const selectedValue = toggle.value as string;

      if ((event.value as string[]).some((item: string) => item === selectedValue)) {
        group.value = [selectedValue];
        this.ganttControlsService.setViewType(selectedValue);
      }
    } else {
      this.ganttControlsService.setViewType(null);
    }
  }

  createDateAtMidnight(date: string | Date): Date {
    const dateAtMidnight = new Date(date);
    dateAtMidnight.setHours(0, 0, 0, 0);
    return dateAtMidnight;
  }

  parseGermanDate(input: string): Date {
    const parts = input.match(/(\d+)/g);
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }
}
