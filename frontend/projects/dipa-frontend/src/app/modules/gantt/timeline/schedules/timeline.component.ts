import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  FormField,
} from 'dipa-api-client';
import { ActivatedRoute, Params } from '@angular/router';
import { ChartComponent } from '../../chart/chart.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import Utils from '../../../../shared/utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnDestroy {
  @ViewChild('ganttChart', { static: true }) public chart: ChartComponent;

  public periodStartDate = new Date(2020, 0, 1);
  public periodEndDate = new Date(2020, 11, 31);

  public timelineData: Timeline[] = [];

  public selectedTimelineId: number;

  public viewTypeSelected: any;

  public operationTypesList: OperationType[] = [];
  public projectApproachesList: ProjectApproach[] = [];
  public projectTask: ProjectTask;
  public appointmentsList: Result[] = [];
  public appointmentsInPeriod: Result[] = [];
  public overdueAppointments: Result[] = [];
  public vm$: Observable<any>;

  public apptFormfieldsKeys = ['goal', 'date', 'status'];
  public apptStartDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  public apptEndDate;
  public periodTemplate = 'PROJECT';

  public schedulePeriods = [
    { key: 'CUSTOM', value: 'ausgewählter Zeitraum' },
    { key: '1_WEEK', value: '1 Woche' },
    { key: '2_WEEKS', value: '2 Wochen' },
    { key: '3_WEEKS', value: '3 Wochen' },
    { key: '4_WEEKS', value: '4 Wochen' },
    { key: '2_MONTHS', value: '2 Monate' },
    { key: '3_MONTHS', value: '3 Monate' },
    { key: '6_MONTHS', value: '6 Monate' },
    { key: 'PROJECT', value: 'Projektende' },
  ];

  public formGroup;
  private periodStartDateSubscription: Subscription;
  private periodEndDateSubscription: Subscription;

  private timelinesSubscription: Subscription;
  private projectTasksSubscription: Subscription;

  public constructor(
    public ganttControlsService: GanttControlsService,
    private timelinesService: TimelinesService,
    private milestonesService: MilestonesService,
    private tasksService: TasksService,
    private incrementsService: IncrementsService,
    private projectService: ProjectService,
    public activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  public ngOnInit(): void {
    this.timelinesSubscription = this.activatedRoute.parent.parent.params.subscribe((params: Params) => {
      this.selectedTimelineId = Number(params.id);
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

    this.projectTasksSubscription = this.projectService.getProjectTasks(this.selectedTimelineId).subscribe({
      next: (data: ProjectTask[]) => {
        this.projectTask = data[4];
        this.appointmentsList = this.projectTask?.results.sort(
          (b, a) =>
            new Date(b.formFields.find((field) => field.key === 'date').value).getTime() -
            new Date(a.formFields.find((field) => field.key === 'date').value).getTime()
        );
        this.filterAllOverdueAppointments(this.appointmentsList);
        this.filterAllOpenAppointmentsInPeriod(this.appointmentsList);

        const keysOrder = {};
        this.apptFormfieldsKeys.forEach((id, i) => {
          keysOrder[id] = i + 1;
        });

        this.appointmentsList?.forEach((result) => {
          result.formFields = result.formFields.filter((field) => this.apptFormfieldsKeys.includes(field.key));
          result.formFields.sort((a, b) => keysOrder[a.key] - keysOrder[b.key]);
        });
      },
      error: null,
      complete: () => void 0,
    });
  }

  public ngOnDestroy(): void {
    this.timelinesSubscription?.unsubscribe();
    this.periodStartDateSubscription?.unsubscribe();
    this.periodEndDateSubscription?.unsubscribe();
    this.projectTasksSubscription?.unsubscribe();
  }

  public setData(): void {
    this.vm$ = forkJoin([
      this.timelinesService.getTimelines(),
      this.tasksService.getTasksForTimeline(this.selectedTimelineId),
      this.milestonesService.getMilestonesForTimeline(this.selectedTimelineId),
      this.incrementsService.getIncrementsForTimeline(this.selectedTimelineId),
    ]).pipe(
      map(([timelineData, taskData, milestoneData, incrementsData]) => {
        this.timelineData = timelineData;
        const selectedTimeline = this.timelineData.find((c) => c.id === Number(this.selectedTimelineId));
        const periodStartDate = new Date(selectedTimeline.start);
        const periodEndDate = new Date(selectedTimeline.end);

        // set default appointments list end to project end
        this.apptEndDate = this.datePipe.transform(periodEndDate, 'yyyy-MM-dd');
        this.filterAllOpenAppointmentsInPeriod(this.appointmentsList);

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

  public onChangeAppointmentPeriodStart(event: Event): void {
    if ((event.target as HTMLInputElement).value !== null) {
      this.apptStartDate = (event.target as HTMLInputElement).value;
      this.periodTemplate = 'CUSTOM';
      this.filterAllOpenAppointmentsInPeriod(this.appointmentsList);
    }
  }

  public onChangeAppointmentPeriodEnd(event: Event): void {
    if ((event.target as HTMLInputElement).value !== null) {
      this.apptEndDate = (event.target as HTMLInputElement).value;
      this.periodTemplate = 'CUSTOM';
      this.filterAllOpenAppointmentsInPeriod(this.appointmentsList);
    }
  }

  public filterAllOverdueAppointments(appointments: Result[]): void {
    const today = Utils.createDateAtMidnight(new Date());

    const appointmentsInPeriod = appointments.filter((appt) => {
      const dateValue = appt.formFields.find((field) => field.key === 'date').value;
      if (dateValue == null) {
        return false;
      }

      const apptDate = Utils.createDateAtMidnight(dateValue);
      return apptDate && apptDate <= today;
    });
    this.overdueAppointments = appointmentsInPeriod.filter(
      (appt) => appt.formFields.find((field) => field.key === 'status').value !== 'CLOSED'
    );
  }

  public filterAllOpenAppointmentsInPeriod(appointments: Result[]): void {
    const appointmentsInPeriod = appointments.filter((appt) => {
      const dateValue = appt.formFields.find((field) => field.key === 'date').value;
      if (dateValue == null) {
        return false;
      }

      const apptDate = Utils.createDateAtMidnight(dateValue);
      return (
        apptDate >= Utils.createDateAtMidnight(new Date(this.apptStartDate)) &&
        apptDate <= Utils.createDateAtMidnight(new Date(this.apptEndDate))
      );
    });
    this.appointmentsInPeriod = appointmentsInPeriod.filter(
      (appt) => appt.formFields.find((field) => field.key === 'status').value !== 'CLOSED'
    );
  }

  public changePeriodTemplates(value: string): void {
    this.apptStartDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    let now = new Date();
    switch (value) {
      case 'CUSTOM':
        return;
      case '1_WEEK':
        now.setDate(now.getDate() + 7);
        break;
      case '2_WEEKS':
        now.setDate(now.getDate() + 2 * 7);
        break;
      case '3_WEEKS':
        now.setDate(now.getDate() + 3 * 7);
        break;
      case '4_WEEKS':
        now.setDate(now.getDate() + 4 * 7);
        break;
      case '2_MONTHS':
        now.setMonth(now.getMonth() + 2);
        break;
      case '3_MONTHS':
        now.setMonth(now.getMonth() + 3);
        break;
      case '6_MONTHS':
        now.setMonth(now.getMonth() + 6);
        break;
      case 'PROJECT':
        const selectedTimeline = this.timelineData.find((c) => c.id === Number(this.selectedTimelineId));
        now = new Date(selectedTimeline.end);
        break;
    }
    this.apptEndDate = this.datePipe.transform(now, 'yyyy-MM-dd');

    this.filterAllOpenAppointmentsInPeriod(this.appointmentsList);
  }

  public isOverdueAppointment(formField: FormField): boolean {
    return formField.key === 'date' && new Date(formField.value) < new Date();
  }
}
