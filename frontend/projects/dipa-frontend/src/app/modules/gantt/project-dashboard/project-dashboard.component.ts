import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { NavItem } from '../../../nav-item';
import { MatSelectChange } from '@angular/material/select';
import {
  Milestone,
  MilestonesService,
  PermanentProjectTask,
  Project,
  ProjectEvent,
  ProjectEventTemplate,
  ProjectRole,
  ProjectService,
  ProjectTask,
  Result,
  Timeline,
  TimelinesService,
  User,
  UserService,
} from 'dipa-api-client';
import Utils from '../../../shared/utils';
import { TimelineDataService } from '../../../shared/timelineDataService';
import { DatePipe } from '@angular/common';

interface ProjectSize {
  value: string;
  display: string;
  description: string;
}

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

interface MilestoneEntry {
  name: string;
  dateTime: string;
  milestoneDate: string;
  due: number;
}

interface ProjectRoleEntry {
  abbreviation: string;
  role: string;
  username: string;
}

interface KeyValuePair {
  key: string;
  value: string;
}

interface ColumnFilter {
  name: string;
  columnProp: string;
  options: string[];
  modelValue: string[];
}

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectDashboardComponent implements OnInit, OnDestroy {
  public math = Math;

  public globalEntryLimit = 5;

  public today = Utils.createDateAtMidnight(new Date());
  public dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

  public periodStartDate = new Date(2020, 0, 1);
  public periodEndDate = new Date(2020, 11, 31);

  public allUsers: User[];
  public timelineData: Timeline[] = [];

  public selectedTimelineId: number;

  public sizes: ProjectSize[] = [
    {
      value: 'SMALL',
      display: 'klein',
      description: 'Aufwand < 250 PT',
    },
    {
      value: 'MEDIUM',
      display: 'mittel',
      description: 'Aufwand 250 - 1.500 PT',
    },
    {
      value: 'BIG',
      display: 'groß',
      description: 'Aufwand > 1.500 PT',
    },
  ];

  public projectProgress = 0;

  public projectData = {
    name: '',
    akz: '',
    description: '',
  };

  public appointmentsList: EventEntry[] = [];
  public appointmentsListProjectTasks: ProjectTask[] = [];
  public openEventsInPeriod: EventEntry[] = [];
  public overdueEvents: EventEntry[] = [];

  public organisationNavItem: NavItem = { icon: '', name: '' };
  public schedulesNavItem: NavItem = { icon: '', name: '' };

  public projectDetailsDisplayedColumns = ['key', 'value'];
  public projectDetailsDataSource = new MatTableDataSource();

  public milestoneDisplayedColumns = ['milestoneDate', 'name', 'due'];
  public milestoneDataSource = new MatTableDataSource();

  public eventDisplayedColumns = ['eventType', 'eventDate', 'title', 'due'];
  public eventDataSource = new MatTableDataSource();
  public filterValues: { [key: string]: string[] } = {};
  public expandedEventElement: EventEntry | null;

  public overdueEventDisplayedColumns = ['eventType', 'eventDate', 'title', 'due'];
  public overdueEventDataSource = new MatTableDataSource();
  public filterOverdueValues: { [key: string]: string[] } = {};
  public expandedOverdueEventElement: EventEntry | null;

  public organisationDisplayedColumns = ['abbreviation', 'role', 'user'];
  public organisationDataSource = new MatTableDataSource();

  public projectDescriptionData: KeyValuePair = { key: 'Beschreibung', value: '<h2>Beschreibung</h2>' };

  public filterSelectObj: ColumnFilter[] = [];
  public filterSelectOverdueObj: ColumnFilter[] = [];

  public projectStartDate;
  public projectEndDate;
  public projectDaysLeft;

  private paramsSubscription: Subscription;
  private projectSubscription: Subscription;
  private dataSubscription: Subscription;

  public constructor(
    public router: Router,
    private milestonesService: MilestonesService,
    private timelinesService: TimelinesService,
    private timelineDataService: TimelineDataService,
    private userService: UserService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.filterSelectObj = [
      {
        name: 'eventType',
        columnProp: 'eventType',
        options: [],
        modelValue: [],
      },
    ];
    this.filterSelectOverdueObj = [
      {
        name: 'eventType',
        columnProp: 'eventType',
        options: [],
        modelValue: [],
      },
    ];
  }

  public ngOnInit(): void {
    this.paramsSubscription = this.activatedRoute.parent.parent.params.subscribe((params: Params) => {
      this.selectedTimelineId = parseInt(params.id, 10);

      this.timelineDataService.setProjectData(this.selectedTimelineId);
      this.projectSubscription = this.timelineDataService.getProjectData().subscribe((data: Project) => {
        this.projectData = { akz: data?.akz, name: data?.name, description: data?.description };

        const keyValues: KeyValuePair[] = [];
        keyValues.push({ key: 'Projektgröße', value: this.displayProjectSize(data?.projectSize) });
        keyValues.push({ key: 'Kunde', value: data?.client || '-' });
        keyValues.push({ key: 'Verantwortlicher Bereich', value: data?.department || '-' });

        this.projectDetailsDataSource.data = keyValues;
      });

      this.setData();

      this.organisationNavItem = {
        name: 'Unsere Projektorganisation',
        icon: 'person_add_alt_1',
        route: `gantt/${this.selectedTimelineId}/project-organization`,
      };
      this.schedulesNavItem = {
        name: 'Unsere Termine',
        icon: 'event_note',
        route: `gantt/${this.selectedTimelineId}/timeline/schedules`,
      };

      this.eventDataSource.filterPredicate = this.getFilterPredicate();
      this.overdueEventDataSource.filterPredicate = this.getFilterPredicate();
    });
  }

  public ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
  }

  public setData(): void {
    this.dataSubscription = forkJoin([
      this.timelinesService.getTimelines(),
      this.userService.getUsers(),
      this.milestonesService.getMilestonesForTimeline(this.selectedTimelineId),
      this.projectService.getEvents(this.selectedTimelineId),
      this.projectService.getPermanentProjectTasks(this.selectedTimelineId),
      this.projectService.getProjectRoles(this.selectedTimelineId),
    ]).subscribe(([timelineData, allUsers, milestoneData, eventData, projectTaskData, projectRoles]) => {
      this.timelineData = timelineData;

      const selectedTimeline = this.timelineData.find((c) => c.id === Number(this.selectedTimelineId));
      const periodStartDate = new Date(selectedTimeline.start);
      const periodEndDate = new Date(selectedTimeline.end);

      // set default appointments list end to project end
      this.projectStartDate = new Date(selectedTimeline.start).toLocaleDateString('de-DE', this.dateOptions);
      this.projectEndDate = new Date(selectedTimeline.end).toLocaleDateString('de-DE', this.dateOptions);
      this.openEventsInPeriod = this.filterAllOpenAppointmentsInPeriod(this.appointmentsList);

      this.projectDaysLeft = Math.round(
        (Utils.createDateAtMidnight(periodEndDate).getTime() - this.today.getTime()) / (1000 * 3600 * 24)
      );
      const projectDurationInDays =
        (Utils.createDateAtMidnight(periodEndDate).getTime() - Utils.createDateAtMidnight(periodStartDate).getTime()) /
        (1000 * 3600 * 24);

      this.projectProgress = Math.round((1 - this.projectDaysLeft / projectDurationInDays) * 100);

      this.milestoneDataSource.data = this.generateMilestoneList(milestoneData);

      this.allUsers = allUsers;

      this.organisationDataSource.data = this.generateProjectRolesList(projectRoles);

      if (this.appointmentsList?.length === 0) {
        this.appointmentsList = this.generateEventList(eventData, projectTaskData).sort(
          (b, a) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        this.overdueEvents = this.filterAllOverdueAppointments(this.appointmentsList);
        this.openEventsInPeriod = this.filterAllOpenAppointmentsInPeriod(this.appointmentsList);

        this.eventDataSource.data = this.openEventsInPeriod;
        this.filterSelectObj.filter((o: ColumnFilter) => {
          o.options = this.getFilterObject(this.eventDataSource.data, o.columnProp);
        });

        this.overdueEventDataSource.data = this.overdueEvents;
        this.filterSelectOverdueObj.filter((o: ColumnFilter) => {
          o.options = this.getFilterObject(this.overdueEventDataSource.data, o.columnProp);
        });
      }
    });
  }

  public displayProjectSize(size: string): string {
    return this.sizes.find((x: ProjectSize) => x.value === size)?.display;
  }

  public onItemSelected(item: NavItem): void {
    if (item.route) {
      void this.router.navigate([item.route]);
    }
  }

  public filterChange(filter: ColumnFilter, event: MatSelectChange): void {
    this.filterValues[filter.columnProp] = event.value as string[];
    this.eventDataSource.filter = JSON.stringify(this.filterValues);
  }

  public filterOverdueChange(filter: ColumnFilter, event: MatSelectChange): void {
    this.filterOverdueValues[filter.columnProp] = event.value as string[];
    this.overdueEventDataSource.filter = JSON.stringify(this.filterOverdueValues);
  }

  public getSelectTrigger(modelValue: string[]): string {
    if (!modelValue) {
      return '';
    }
    return modelValue.map((value) => Utils.getEventTypeAbbreviation(value)).join(', ');
  }

  public filterAllOverdueAppointments(appointments: EventEntry[]): EventEntry[] {
    if (appointments == null) {
      return [];
    }

    const appointmentsInPeriod = appointments.filter((appt) => {
      if (appt.eventDate == null) {
        return false;
      }

      const apptDate = Utils.createDateAtMidnight(appt.dateTime);
      return apptDate && apptDate <= this.today;
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
      if (appt.eventDate == null) {
        return false;
      }

      const apptDate = Utils.createDateAtMidnight(appt.dateTime);
      return apptDate >= this.today && apptDate <= Utils.createDateAtMidnight(new Date(this.projectEndDate));
    });
    return appointmentsInPeriod?.filter((appt) => appt.status !== 'CLOSED').slice(0, this.globalEntryLimit);
  }

  private getFilterPredicate<T>(): (data: T, filter: string) => boolean {
    return (data: T, filter: string): boolean => {
      const searchTerms = JSON.parse(filter) as { [key: string]: string[] };
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }

      let found = false;
      const search = () => {
        for (const col in searchTerms) {
          if (searchTerms.hasOwnProperty(col)) {
            searchTerms[col].forEach((searchTerm) => {
              const searchCol = data[col] as string;
              if (searchCol.toString().indexOf(searchTerm) !== -1) {
                found = true;
              }
            });
          }
        }
        return found;
      };

      return !isFilterSet || search();
    };
  }

  private getFilterObject<T>(fullObj: T[], key: string): string[] {
    const filterSet: string[] = [];
    fullObj.forEach((obj: T) => {
      if (!filterSet.includes(obj[key])) {
        filterSet.push(obj[key]);
      }
      return obj;
    });
    return filterSet;
  }

  private generateMilestoneList(milestoneData: Milestone[]): MilestoneEntry[] {
    let milestoneList: MilestoneEntry[] = [];

    milestoneData
      .filter((ms) => {
        const msDate = Utils.createDateAtMidnight(ms.date);
        return msDate && msDate >= this.today;
      })
      .forEach((milestone: Milestone) => {
        milestoneList.push({
          name: milestone.name,
          milestoneDate: new Date(milestone.date).toLocaleDateString('de-DE', this.dateOptions),
          dateTime: this.datePipe.transform(milestone.date, 'yyyy-MM-dd'),
          due: Math.round(
            (Utils.createDateAtMidnight(milestone.date).getTime() - this.today.getTime()) / (1000 * 3600 * 24)
          ),
        });
      });

    milestoneList = milestoneList.sort((b, a) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

    return milestoneList.slice(0, this.globalEntryLimit);
  }

  private filterAllUsersInRole(role: ProjectRole): User[] {
    return this.allUsers.filter((user) => user.projectRoles.some((item) => item.id === role.id));
  }

  private generateProjectRolesList(projectRoles: ProjectRole[]): ProjectRoleEntry[] {
    const projectRolesList: ProjectRoleEntry[] = [];

    projectRoles.forEach((projectRole: ProjectRole) => {
      const assignedUsers = this.filterAllUsersInRole(projectRole);
      projectRolesList.push({
        abbreviation: projectRole.abbreviation,
        role: projectRole.name,
        username: assignedUsers.map((user) => user.name).join(', ') || '-',
      });
    });

    return projectRolesList.filter((d) => d.abbreviation === 'PL' || d.abbreviation === 'PE');
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
          eventDate: new Date(event.dateTime).toLocaleDateString('de-DE', this.dateOptions),
          eventTime: '',
          dateTime: this.datePipe.transform(event.dateTime, 'yyyy-MM-dd'),
          due: (Utils.createDateAtMidnight(event.dateTime).getTime() - this.today.getTime()) / (1000 * 3600 * 24),
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
        eventDate: new Date(eventDate).toLocaleDateString('de-DE', this.dateOptions),
        eventTime: '',
        dateTime: this.datePipe.transform(eventDate, 'yyyy-MM-dd'),
        due: (Utils.createDateAtMidnight(eventDate).getTime() - this.today.getTime()) / (1000 * 3600 * 24),
        duration: 0,
        status: result.formFields.find((field) => field.key === 'status').value,
        mandatory: true,
        visibility: false,
      });
    });

    return eventList;
  }
}
