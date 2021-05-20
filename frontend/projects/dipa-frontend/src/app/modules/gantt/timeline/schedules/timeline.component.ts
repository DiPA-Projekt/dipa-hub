import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { GanttControlsService } from '../../gantt-controls.service';
import {
  IncrementsService,
  MilestonesService,
  OperationType,
  ProjectApproach,
  TasksService,
  Timeline,
  TimelinesService,
  ProjectService,
  ProjectTask,
  Result,
} from 'dipa-api-client';
import { ActivatedRoute, Params } from '@angular/router';
import { ChartComponent } from '../../chart/chart.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import Utils from '../../../../shared/utils';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnDestroy {
  @ViewChild('ganttChart', { static: true }) chart: ChartComponent;

  public periodStartDate = new Date(2020, 0, 1);
  public periodEndDate = new Date(2020, 11, 31);

  public timelineData: Timeline[] = [];

  public selectedTimelineId: number;

  public viewTypeSelected: any;

  public operationTypesList: OperationType[] = [];
  public projectApproachesList: ProjectApproach[] = [];
  public projectTask: ProjectTask;
  public appoinmentsList: Result[];
  public appointments: any[] = [];
  public vm$: Observable<any>;

  public apptFormfieldsKeys = ['goal', 'date', 'status'];

  public formGroup;
  private periodStartDateSubscription: Subscription;
  private periodEndDateSubscription: Subscription;

  private timelinesSubscription: Subscription;
  private activatedRouteSubscription: Subscription;
  private projectTasksSubscription: Subscription;

  public constructor(
    public ganttControlsService: GanttControlsService,
    private timelinesService: TimelinesService,
    private milestonesService: MilestonesService,
    private tasksService: TasksService,
    private incrementsService: IncrementsService,
    private projectService: ProjectService,
    public activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.timelinesSubscription = this.activatedRoute.parent.parent.params
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

    this.projectTasksSubscription = this.projectService.getProjectTasks(this.selectedTimelineId).subscribe((data) => {
      this.projectTask = data[4];
      this.projectTask.results.sort(
        (b, a) =>
          new Date(b.formFields.find((field) => field.key === 'date').value).getTime() -
          new Date(a.formFields.find((field) => field.key === 'date').value).getTime()
      );

      const keysOrder = {};
      this.apptFormfieldsKeys.forEach((id, i) => {
        keysOrder[id] = i + 1;
      });

      this.projectTask.results.forEach((result) => {
        result.formFields = result.formFields.filter((field) => this.apptFormfieldsKeys.includes(field.key));
        result.formFields.sort((a, b) => keysOrder[a.key] - keysOrder[b.key]);
      });
    });
  }

  public ngOnDestroy(): void {
    this.periodStartDateSubscription?.unsubscribe();
    this.periodEndDateSubscription?.unsubscribe();
    this.projectTasksSubscription?.unsubscribe();
  }

  public setData(): void {
    this.vm$ = forkJoin([
      this.tasksService.getTasksForTimeline(this.selectedTimelineId),
      this.milestonesService.getMilestonesForTimeline(this.selectedTimelineId),
      this.incrementsService.getIncrementsForTimeline(this.selectedTimelineId),
    ]).pipe(
      map(([taskData, milestoneData, incrementsData]) => {
        const milestoneDates = milestoneData.map((x) => Utils.createDateAtMidnight(x.date));
        const taskStartDates = taskData.map((x) => Utils.createDateAtMidnight(x.start));
        const taskEndDates = taskData.map((x) => Utils.createDateAtMidnight(x.end));

        const selectedTimeline = this.timelineData.find((c) => c.id === Number(this.selectedTimelineId));

        const periodStartDate = new Date(selectedTimeline.start);
        const periodEndDate = new Date(selectedTimeline.end);

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

  public changeViewType(event: MatButtonToggleChange): void {
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

  public changeStatus(value: string, appointmentId: number, formfieldId: number): void {
    this.projectTask.results
      .find((result) => result.id === appointmentId)
      .formFields.find((field) => field.id === formfieldId).value = value;
    this.projectService.updateProjectTask(this.selectedTimelineId, this.projectTask).subscribe({
      next: null,
      error: null,
      complete: () => void 0,
    });
  }

  public filterOpenAppointments(appointments): boolean {
    return appointments.formFields.find((field) => field.key === 'status').value !== 'DONE';
  }
}
