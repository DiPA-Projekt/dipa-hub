import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GanttControlsService} from './gantt-controls.service';
import {ChartComponent} from './chart/chart.component';
import {forkJoin, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {MilestonesService, TasksService, TimelinesService, TimelinesIncrementService, IncrementsService,
  ProjectTypesService, ProjectApproachesService} from 'dipa-api-client';
import { ActivatedRoute } from '@angular/router';

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

  projectTypesSubscription;
  projectApproachesSubscription;

  vm$: Observable<any>;

  timelineData = [];

  timelinesSubscription;
  activatedRouteSubscription;

  selectedTimelineId: number;
  selectedProjectApproachId: number;
  selectedProjectTypeId: number;
  selectedProjectTypeName: string;

  viewTypeSelected: any;

  projectTypesList = [];
  projectApproachesList = [];

  constructor(public ganttControlsService: GanttControlsService,
              private timelinesService: TimelinesService,
              private milestonesService: MilestonesService,
              private tasksService: TasksService,
              private timelinesIncrementService: TimelinesIncrementService,
              private incrementService: IncrementsService,
              private projectTypesService: ProjectTypesService,
              private projectApproachesService: ProjectApproachesService,
              public activatedRoute: ActivatedRoute) {  }

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
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(param => {
      this.selectedTimelineId = param.id;
      this.timelinesSubscription = this.timelinesService.getTimelines()
        .subscribe((data) => {
          this.timelineData = data;

          this.selectedProjectTypeId = this.timelineData.find(item => item.id === Number(this.selectedTimelineId)).projectTypeId;
          this.selectedProjectApproachId = this.timelineData.find(item => item.id === Number(this.selectedTimelineId)).projectApproachId;

          this.projectTypesSubscription = this.projectTypesService.getProjectTypes()
          .subscribe((res) => {

            this.selectedProjectTypeName = res.find(item => item.id === Number(this.selectedProjectTypeId)).name;
          });

          this.setData();
        });
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

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches()
    .subscribe((data) => {
      this.projectApproachesList = data;
    });
  }

  ngOnDestroy(): void {
    this.activatedRouteSubscription.unsubscribe();
    this.periodStartDateSubscription.unsubscribe();
    this.periodEndDateSubscription.unsubscribe();
    this.projectTypesSubscription.unsubscribe();
    this.projectApproachesSubscription.unsubscribe();
  }

  getIcsCalendarFile(): void {

    const filename = 'Meilensteine.ics';

    this.timelinesService.getTimelineCalendar(this.selectedTimelineId)
      .subscribe(
        (response: any) => {
          const dataType = response.type;
          const binaryData = [response];
          // use a temporary link with document-attribute for naming file
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          if (filename) {
            downloadLink.setAttribute('download', filename);
          }
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
        }
      );
  }

  setData(): void {
    this.vm$ = forkJoin([
      this.tasksService.getTasksForTimeline(this.selectedTimelineId),
      this.milestonesService.getMilestonesForTimeline(this.selectedTimelineId),
      this.incrementService.getIncrementsForTimeline(this.selectedTimelineId)
    ])
    .pipe(
      map(([taskData, milestoneData, incrementsData]) => {
        const milestoneDates = milestoneData.map(x => this.createDateAtMidnight(x.date));
        const taskStartDates = taskData.map(x => this.createDateAtMidnight(x.start));
        const taskEndDates = taskData.map(x => this.createDateAtMidnight(x.end));

        const datesArray: Date[] = [...milestoneDates, ...taskStartDates, ...taskEndDates];

        const periodStartDate = GanttComponent.getMinimumDate(datesArray);
        const periodEndDate = GanttComponent.getMaximumDate(datesArray);

        const selectedTimeline = this.timelineData.find(c => c.id === Number(this.selectedTimelineId));

        return {
          milestoneData,
          taskData,
          incrementsData,
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

  changeProjectApproach(event): void {

    const selectedTimeline = this.timelineData.find(item => item.id === Number(this.selectedTimelineId));

    selectedTimeline.projectApproachId = event.value;

    this.timelinesService.updateProject(selectedTimeline.id, selectedTimeline)
      .subscribe((d) => {
        this.timelinesSubscription = this.timelinesService.getTimelines().subscribe((data) => {
          this.timelineData = data;

          this.selectedProjectApproachId = this.timelineData.find(item => item.id === Number(this.selectedTimelineId)).projectApproachId;

          this.setData();
        });
      });
  }

  filterProjectApproaches(): any[] {
    return this.projectApproachesList.filter(projectApproach => projectApproach.projectTypeId === this.selectedProjectTypeId);
  }

  createDateAtMidnight(date: any): Date {
    const dateAtMidnight = new Date(date);
    dateAtMidnight.setHours(0, 0, 0, 0);
    return dateAtMidnight;
  }

  parseGermanDate(input: string): Date {
    const parts = input.match(/(\d+)/g);
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }

  getTimelineName(): any {
    return this.timelineData.find(t => t.id === this.selectedTimelineId);
  }

}
