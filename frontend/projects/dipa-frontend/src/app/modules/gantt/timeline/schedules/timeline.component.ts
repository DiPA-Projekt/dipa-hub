import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GanttControlsService } from '../../gantt-controls.service';
import {
  ProjectEvent,
  ProjectEventTemplate,
  IncrementsService,
  MilestonesService,
  OperationType,
  PermanentProjectTask,
  ProjectApproach,
  ProjectService,
  ProjectTask,
  Result,
  TasksService,
  Timeline,
  TimelinesService,
} from 'dipa-api-client';
import { ActivatedRoute, Params } from '@angular/router';
import { ChartComponent } from '../../chart/chart.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import Utils from '../../../../shared/utils';
import { DatePipe } from '@angular/common';
import { TimelineDataService } from '../../../../shared/timelineDataService';

interface EventEntry {
  id: number;
  seriesId: number;
  eventType: string; // TYPE_APPT_SERIES, TYPE_SINGLE_APPOINTMENT, TYPE_RECURRING_EVENT
  title: string;
  eventDate: string;
  eventTime: string;
  due: number;
  dateTime: string;
  duration: number;
  status: string; // OPEN, DONE
  mandatory: boolean;
  visibility: boolean;
  // participants: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnDestroy {
  @ViewChild('ganttChart', { static: true }) public chart: ChartComponent;

  public today = Utils.createDateAtMidnight(new Date());

  public periodStartDate = new Date(2020, 0, 1);
  public periodEndDate = new Date(2020, 11, 31);

  public timelineData: Timeline[] = [];
  public selectedTimeline: Timeline;

  public selectedTimelineId: number;

  public viewTypeSelected: any;

  public operationTypesList: OperationType[] = [];
  public projectApproachesList: ProjectApproach[] = [];
  public appointmentsListProjectTasks: ProjectTask[] = [];
  public appointmentsList: EventEntry[] = [];

  public openEventsInPeriod: EventEntry[] = [];
  public overdueEvents: EventEntry[] = [];

  public filteredEventList: EventEntry[] = [];
  public filteredOpenEventList: EventEntry[] = [];
  public filteredOverdueEventList: EventEntry[] = [];

  public vm$: Observable<any>;

  public appointmentVisibility = false;
  public overdueVisibility = false;

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

  private eventsSubscription: Subscription;
  private timelineDataSubscription: Subscription;
  private timelinesSubscription: Subscription;
  private projectTasksSubscription: Subscription;

  public constructor(
    public ganttControlsService: GanttControlsService,
    private timelineDataService: TimelineDataService,
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

    this.timelineDataSubscription = this.timelineDataService.getTimelines().subscribe(() => {
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

  public ngOnDestroy(): void {
    this.eventsSubscription?.unsubscribe();
    this.timelineDataSubscription?.unsubscribe();
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
      this.projectService.getEvents(this.selectedTimelineId),
      this.projectService.getPermanentProjectTasks(this.selectedTimelineId),
    ]).pipe(
      map(([timelineData, taskData, milestoneData, incrementsData, eventData, projectTaskData]) => {
        this.timelineData = timelineData;
        const selectedTimeline = this.timelineData.find((c) => c.id === Number(this.selectedTimelineId));
        const periodStartDate = new Date(selectedTimeline.start);
        const periodEndDate = new Date(selectedTimeline.end);

        this.selectedTimeline = selectedTimeline;

        // set default appointments list end to project end
        this.apptEndDate = this.datePipe.transform(periodEndDate, 'yyyy-MM-dd');
        this.openEventsInPeriod = this.filterAllOpenAppointmentsInPeriod(this.appointmentsList);

        if (this.appointmentsList?.length === 0) {
          this.appointmentsList = this.generateEventList(eventData, projectTaskData).sort(
            (b, a) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
          );

          this.overdueEvents = this.filterAllOverdueAppointments(this.appointmentsList);
          this.openEventsInPeriod = this.filterAllOpenAppointmentsInPeriod(this.appointmentsList);

          this.filteredOpenEventList = [...this.openEventsInPeriod];
          this.filteredOverdueEventList = [...this.overdueEvents];

          this.filteredEventList = [...this.filteredOpenEventList, ...this.filteredOverdueEventList];
        }

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

  public changeStatus(entry: EventEntry): void {
    if (entry.eventType === 'TYPE_SINGLE_APPOINTMENT') {
      this.appointmentsListProjectTasks.forEach((task: PermanentProjectTask) => {
        const foundResult = task.projectTask.results.find((result) => result.id === entry.id);
        if (foundResult) {
          foundResult.formFields.find((field) => field.key === 'status').value = entry.status;
          this.projectService.updateProjectTask(this.selectedTimelineId, task.projectTask).subscribe({
            next: null,
            error: null,
            complete: () => void 0,
          });
          return;
        }
      });
    } else {
      const projectEvent: ProjectEvent = { id: entry.id, status: entry.status as ProjectEvent.StatusEnum };
      this.projectService.updateProjectEvent(this.selectedTimelineId, projectEvent).subscribe({
        next: null,
        error: null,
        complete: () => void 0,
      });
    }
  }

  public filterAllOverdueAppointments(appointments: EventEntry[]): EventEntry[] {
    if (appointments == null) {
      return [];
    }

    const today = Utils.createDateAtMidnight(new Date());

    const appointmentsInPeriod = appointments.filter((appt) => {
      if (appt.dateTime == null) {
        return false;
      }

      const apptDate = Utils.createDateAtMidnight(appt.dateTime);
      return apptDate && apptDate <= today;
    });

    return appointmentsInPeriod?.filter(
      (appt) =>
        (appt.eventType === 'TYPE_SINGLE_APPOINTMENT' && appt.status !== 'CLOSED') ||
        (appt.eventType === 'TYPE_RECURRING_EVENT' && appt.status === 'OPEN') ||
        (appt.eventType === 'TYPE_APPT_SERIES' && appt.status === 'OPEN')
    );
  }

  public filterAllOpenAppointmentsInPeriod(appointments: EventEntry[]): EventEntry[] {
    if (appointments == null) {
      return [];
    }

    const appointmentsInPeriod = appointments?.filter((appt) => {
      if (appt.dateTime == null) {
        return false;
      }

      const apptDate = Utils.createDateAtMidnight(appt.dateTime);
      return (
        apptDate >= Utils.createDateAtMidnight(new Date(this.apptStartDate)) &&
        apptDate <= Utils.createDateAtMidnight(new Date(this.apptEndDate))
      );
    });
    return appointmentsInPeriod?.filter((appt) => appt.status !== 'CLOSED');
  }

  public toggleVisibility(appts: EventEntry[]): void {
    if (appts.length > 0) {
      const visibility = appts[0].visibility;
      this.setVisibility(appts, !visibility);
    }
  }

  public refreshOverdueData(rows: EventEntry[]): void {
    this.filteredOverdueEventList = rows;
    // this triggers ngOnChanges in chart
    this.filteredEventList = [...this.filteredOpenEventList, ...this.filteredOverdueEventList];
  }

  public refreshOpenData(rows: EventEntry[]): void {
    this.filteredOpenEventList = rows;
    // this triggers ngOnChanges in chart
    this.filteredEventList = [...this.filteredOpenEventList, ...this.filteredOverdueEventList];
  }

  private setVisibility(entries: EventEntry[], visibility: boolean): void {
    entries.forEach((event) => {
      event.visibility = visibility;
    });
    // this triggers ngOnChanges in chart
    this.filteredEventList = [...this.filteredEventList];
  }

  private generateEventList(eventData: ProjectEventTemplate[], projectTaskData: PermanentProjectTask[]): EventEntry[] {
    const eventList: EventEntry[] = [];

    eventData.forEach((eventTemplate: ProjectEventTemplate) => {
      eventTemplate.events.forEach((event: ProjectEvent) => {
        eventList.push({
          id: event.id,
          seriesId: eventTemplate.id,
          eventType: eventTemplate.eventType,
          title: event.title,
          eventDate: Utils.getGermanFormattedDateString(event.dateTime),
          eventTime: '',
          dateTime: this.datePipe.transform(event.dateTime, 'yyyy-MM-dd'),
          due: Math.round(
            (Utils.createDateAtMidnight(event.dateTime).getTime() - this.today.getTime()) / (1000 * 3600 * 24)
          ),
          duration: event.duration,
          status: event.status,
          mandatory: eventTemplate.eventType === 'TYPE_RECURRING_EVENT' && event.status != null,
          visibility: false,
        });
      });
    });

    let singleAppointmentResults: Result[] = [];

    projectTaskData.forEach((task: PermanentProjectTask) => {
      this.appointmentsListProjectTasks.push(task);
      singleAppointmentResults = singleAppointmentResults.concat(
        task.projectTask.results.filter((result: Result) => result.resultType === 'TYPE_SINGLE_APPOINTMENT')
      );
    });

    singleAppointmentResults.forEach((result: Result) => {
      const eventDate = result.formFields.find((field) => field.key === 'date').value;

      eventList.push({
        id: result.id,
        seriesId: -1,
        eventType: result.resultType,
        title: result.formFields.find((field) => field.key === 'goal').value,
        eventDate: Utils.getGermanFormattedDateString(eventDate),
        eventTime: '',
        dateTime: this.datePipe.transform(eventDate, 'yyyy-MM-dd'),
        due: Math.round((Utils.createDateAtMidnight(eventDate).getTime() - this.today.getTime()) / (1000 * 3600 * 24)),
        duration: 0,
        status: result.formFields.find((field) => field.key === 'status').value,
        mandatory: true,
        visibility: false,
      });
    });

    return eventList;
  }
}
