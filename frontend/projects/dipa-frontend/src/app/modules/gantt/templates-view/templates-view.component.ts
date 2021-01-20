import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GanttControlsService } from '../gantt-controls.service';
import { TemplatesComponent } from './templates/templates.component';
import {
  IncrementsService,
  MilestonesService,
  ProjectApproachesService,
  OperationTypesService,
  TasksService,
  TimelinesIncrementService,
  TimelinesService,
  ExternalLinksUserService,
  TemplatesService} from 'dipa-api-client';

import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-templates-view',
  templateUrl: './templates-view.component.html',
  styleUrls: ['./templates-view.component.scss']
})

export class TemplatesViewComponent implements OnInit {

  @ViewChild('templateChart', { static: true }) template: TemplatesComponent;

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  periodStartDateSubscription;
  periodEndDateSubscription;

  operationTypesSubscription;
  projectApproachesSubscription;

  vm$: Observable<any>;

  timelineData = [];

  timelinesSubscription;
  activatedRouteSubscription;

  selectedTimelineId: number;
  selectedProjectApproachId: number;
  selectedOperationTypeId: number;
  selectedOperationTypeName: string;

  viewTypeSelected: any;

  operationTypesList = [];
  projectApproachesList = [];
  
  navMenuItems: ({ name: string; icon: string; route: string; } | { name: string; icon: string; route?: undefined; })[];
  favoriteLinksSubscription: any;
  favoriteLinkItems: { name: string; icon: string; children: any; }[];

  constructor(public ganttControlsService: GanttControlsService,
              private timelinesService: TimelinesService,
              private milestonesService: MilestonesService,
              private tasksService: TasksService,
              private timelinesIncrementService: TimelinesIncrementService,
              private incrementService: IncrementsService,
              private operationTypesService: OperationTypesService,
              private projectApproachesService: ProjectApproachesService,
              public activatedRoute: ActivatedRoute,
              private templateService: TemplatesService,
              private externalLinksUserService: ExternalLinksUserService,
              private router: Router) {  }

  ngOnInit(): void {

    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(param => {
      this.selectedTimelineId = param.id;
      this.timelinesSubscription = this.timelinesService.getTimelines()
        .subscribe((data) => {
          this.timelineData = data;

          this.setData();
          this.setSideNavMenu();

        });
    });

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches()
    .subscribe((data) => {
      this.projectApproachesList = data;
    });
  }

  ngOnDestroy(): void {
    this.activatedRouteSubscription.unsubscribe();

    this.projectApproachesSubscription.unsubscribe();
  }


  setData(): void {
    this.vm$ = forkJoin([
      // this.tasksService.getTasksForTimeline(this.selectedTimelineId),
      // this.milestonesService.getMilestonesForTimeline(this.selectedTimelineId),
      // this.incrementService.getIncrementsForTimeline(this.selectedTimelineId)
      this.templateService.getTemplatesForTimeline(this.selectedTimelineId)
    ])
    .pipe(
      map(([templatesData]) => {

        // const milestoneDates = milestoneData.map(x => this.createDateAtMidnight(x.date));
        // const taskStartDates = taskData.map(x => this.createDateAtMidnight(x.start));
        // const taskEndDates = taskData.map(x => this.createDateAtMidnight(x.end));

        // const datesArray: Date[] = [...milestoneDates, ...taskStartDates, ...taskEndDates];

        // const periodStartDate = TemplatesComponent.getMinimumDate(datesArray);
        // const periodEndDate = GanttComponent.getMaximumDate(datesArray);
        const templateData = templatesData;
        console.log(this.timelineData)
        console.log(templatesData)
        const selectedTimeline = this.timelineData.find(c => c.id === Number(this.selectedTimelineId));

        return {
          templateData,
          // taskData,
          // incrementsData,
          selectedTimeline,
          // periodStartDate,
          // periodEndDate
        };
      })
    );
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

  setSideNavMenu(): void {

    this.navMenuItems = [{
        name: 'Zeitplan',
        icon: 'event_note',
        route: 'gantt/' + this.selectedTimelineId
      }, {
        name: 'Stöbern & Vergleichen',
        icon: 'find_replace',
        route: 'gantt/' + this.selectedTimelineId + '/templates'
      }, {
        name: 'Werkzeugkit',
        icon: 'construction'
      }
    ];

    this.favoriteLinksSubscription = this.externalLinksUserService.getFavoriteLinks()
    .subscribe((data) => {

      this.favoriteLinkItems = [
        {
          name: 'Favoriten-Links',
          icon: 'bookmarks',
          children: data.map(x => {
            return {
              name: x.name,
              icon: 'star',
              url: x.url
            };
          })
        }
      ];
    });
  }


}
