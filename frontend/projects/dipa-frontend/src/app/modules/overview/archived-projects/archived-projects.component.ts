import { Component, OnDestroy, OnInit, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { IncrementsService, MilestonesService, TasksService, Timeline, TimelinesService } from 'dipa-api-client';
import { ChartComponent } from '../../gantt/chart/chart.component';
import { forkJoin, Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-archived-projects',
  templateUrl: './archived-projects.component.html',
  styleUrls: ['./archived-projects.component.scss'],
})
export class ArchivedProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('charts') charts: QueryList<ChartComponent>;

  public timelineData: Timeline[];

  public vmAll$: Observable<any>;

  public observablesList: Array<any> = [];

  public loading: boolean;

  public periodStartDate = new Date(2020, 0, 1);
  public periodEndDate = new Date(2020, 11, 31);
  private timelinesSubscription: Subscription;
  private periodStartDateSubscription: Subscription;

  public constructor(
    private timelinesService: TimelinesService,
    private milestonesService: MilestonesService,
    private tasksService: TasksService,
    private incrementsService: IncrementsService,
    private route: ActivatedRoute
  ) {}

  public ngOnDestroy(): void {
    this.timelinesSubscription?.unsubscribe();
  }

  public ngOnInit(): void {
    this.loadTimelines();
  }

  public ngAfterViewInit(): void {
    const joinStream = combineLatest([this.charts.changes, this.route.fragment]);
    joinStream.subscribe(([comps, fragment]: [QueryList<ChartComponent>, string]) => {
      if (fragment !== null) {
        document.getElementById(fragment).scrollIntoView();
      }
    });
  }

  public setData(timelineId: number): Observable<any> {
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

  public loadTimelines(): void {
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
