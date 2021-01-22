import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GanttControlsService } from '../gantt-controls.service';
import { TemplatesComponent } from './templates/templates.component';
import { TemplateItems } from './template-item';

import {
  IncrementsService,
  MilestonesService,
  ProjectApproachesService,
  OperationTypesService,
  TasksService,
  TimelinesIncrementService,
  TimelinesService,
  ExternalLinksUserService,
  TemplatesService,
  Template} from 'dipa-api-client';

import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { TemplatesViewControlsService } from './templates-view-controls.service';

@Component({
  selector: 'app-templates-view',
  templateUrl: './templates-view.component.html',
  styleUrls: ['./templates-view.component.scss']
})

export class TemplatesViewComponent implements OnInit, OnDestroy {

  @ViewChild('templateChart', { static: true }) template: TemplatesComponent;

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

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
  selectedProjectApproachName: string;

  viewTypeSelected: any;

  templatesList = [];
  selectedTemplatesList: any[];
  standardTemplatesList = [];
  selectedStandardTemplateIndex: number;
  projectApproachesList: any;

  standardName;

  constructor(public templatesViewControlsService: TemplatesViewControlsService,
              public ganttControlsService: GanttControlsService,
              private timelinesService: TimelinesService,
              private operationTypesService: OperationTypesService,
              private projectApproachesService: ProjectApproachesService,
              public activatedRoute: ActivatedRoute,
              private templateService: TemplatesService,
              private router: Router) {  }

  ngOnInit(): void {
    this.selectedStandardTemplateIndex = null;

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches()
    .subscribe((data) => {
      this.projectApproachesList = data;
    });

    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(param => {
      this.selectedTimelineId = param.id;

      this.timelinesSubscription = this.timelinesService.getTimelines()
        .subscribe((data) => {

          this.timelineData = data;
          this.setData();

          this.selectedOperationTypeId = this.timelineData.find(item => item.id === Number(this.selectedTimelineId)).operationTypeId;
          this.selectedProjectApproachId = this.timelineData.find(item => item.id === Number(this.selectedTimelineId)).projectApproachId;

          this.operationTypesSubscription = this.operationTypesService.getOperationTypes()
          .subscribe((resOperation) => {

            this.selectedOperationTypeName = resOperation.find(item => item.id === Number(this.selectedOperationTypeId)).name;
          });

          this.selectedProjectApproachName =  this.projectApproachesList
                .find(item => item.id === Number(this.selectedProjectApproachId)).name;

        });
    });



  }


  ngOnDestroy(): void {
    this.activatedRouteSubscription.unsubscribe();
    this.timelinesSubscription.unsubscribe();
    this.projectApproachesSubscription.unsubscribe();
  }

  setData(): void {
    this.vm$ = forkJoin([
      this.timelinesService.getTimelines(),
      this.templateService.getTemplatesForTimeline(this.selectedTimelineId)
    ])
    .pipe(
      map(([timelinesData, templatesData]) => {
        console.log(templatesData)

        this.templatesList = [];

        this.templatesList.push(templatesData.find(t => t.name === 'aktuell'));

        this.standardTemplatesList = templatesData.filter(t => t.standard === true);

        if (this.selectedStandardTemplateIndex === null) {
          this.templatesList.push(templatesData.filter(t => t.standard === true)[0]);
          this.selectedStandardTemplateIndex = 0;
        }
        else {
          this.templatesList.push(templatesData.filter(t => t.standard === true)[this.selectedStandardTemplateIndex]);
        }

        // this.standardName = this.standardTemplatesList[this.selectedStandardTemplateIndex].name;

        const templateData = this.templatesList;
        this.selectedTemplatesList = this.templatesList.map(t => t.id);

        const selectedTimeline = timelinesData.find(c => c.id === Number(this.selectedTimelineId));

        return {
          selectedTimeline,
          templateData,
        };
      })
    );
  }


  onPrevStandard(event): any{

    if (this.standardTemplatesList.length > 0) {
      if (this.selectedStandardTemplateIndex - 1 >= 0) {
        this.selectedStandardTemplateIndex--;
      }
      else {
        this.selectedStandardTemplateIndex = this.standardTemplatesList.length - 1;
      }

      const id = this.standardTemplatesList[this.selectedStandardTemplateIndex].id;
      this.selectedTemplatesList[1] = id;

      this.templatesViewControlsService.setTemplatesList(this.selectedTemplatesList);
    }

  }

  onNextStandard(event): any{

    if (this.standardTemplatesList.length > 0) {
      if (this.selectedStandardTemplateIndex + 1 < this.standardTemplatesList.length ) {

        this.selectedStandardTemplateIndex++;
        this.templatesList[1] = this.selectedStandardTemplateIndex;

      }
      else {
        this.selectedStandardTemplateIndex = 0;

      }
      const id = this.standardTemplatesList[this.selectedStandardTemplateIndex].id;
      this.selectedTemplatesList[1] = id;

      this.templatesViewControlsService.setTemplatesList(this.selectedTemplatesList);
    }

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

  changeViewType(event): void {
    const toggle = event.source;

    if (toggle){
      const group = toggle.buttonToggleGroup;

      if (event.value.some(item => item === toggle.value)) {
        group.value = [toggle.value];
      }
      this.templatesViewControlsService.setViewType(group.value[0]);
    } else {
      this.templatesViewControlsService.setViewType(null);
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
    return this.projectApproachesList.filter(projectApproach => projectApproach.operationTypeId === this.selectedOperationTypeId);
  }

  updateTemplateStandard(event): void {
    const templateId = this.standardTemplatesList[this.selectedStandardTemplateIndex].id;

    this.templateService.updateTemplate(this.selectedTimelineId, templateId).subscribe(data => {
      this.setData();
    });
  }

}
