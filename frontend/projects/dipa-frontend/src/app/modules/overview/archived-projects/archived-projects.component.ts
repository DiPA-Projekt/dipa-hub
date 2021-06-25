import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';

import { IncrementsService, MilestonesService, TasksService, Timeline, TimelinesService } from 'dipa-api-client';
import { ChartComponent } from '../../gantt/chart/chart.component';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-archived-projects',
  templateUrl: './archived-projects.component.html',
  styleUrls: ['./archived-projects.component.scss'],
})
export class ArchivedProjectsComponent implements OnInit, OnDestroy {
  @ViewChildren('charts') charts: QueryList<ChartComponent>;

  timelinesSubscription: Subscription;

  timelineData: Timeline[];

  vmAll$: Observable<any>;
  periodStartDateSubscription: Subscription;

  observablesList: Array<any> = [];

  loading: boolean;

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  constructor(
    private timelinesService: TimelinesService,
    private milestonesService: MilestonesService,
    private tasksService: TasksService,
    private incrementsService: IncrementsService
  ) {}

  ngOnDestroy(): void {
    this.timelinesSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.loadTimelines();
  }

  setData(timelineId: number): Observable<any> {
    this.loading = true;

    return forkJoin([
      this.tasksService.getTasksForTimeline(timelineId),
      this.milestonesService.getMilestonesForTimeline(timelineId),
      this.incrementsService.getIncrementsForTimeline(timelineId),
    ]).pipe(
      map(([taskData, milestoneData, incrementsData]) => {
        this.loading = false;

        const timeline = this.timelineData.find((t: Timeline) => t.id === timelineId);

        return {
          milestoneData,
          taskData,
          timeline,
          incrementsData,
        };
      })
    );
  }

  loadTimelines(): void {
    this.observablesList = [];
    this.timelinesSubscription = this.timelinesService.getArchivedTimelines().subscribe((data) => {
      this.timelineData = data;

      this.timelineData.forEach((timeline) => {
        this.observablesList.push(this.setData(timeline.id));
      });

      this.vmAll$ = forkJoin(this.observablesList);
    });
  }
}
