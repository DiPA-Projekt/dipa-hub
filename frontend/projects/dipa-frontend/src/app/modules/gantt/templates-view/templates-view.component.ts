import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GanttControlsService } from '../gantt-controls.service';
import { TemplatesComponent } from './templates/templates.component';

import {
  OperationTypesService,
  ProjectApproachesService,
  TimelineTemplatesService,
  TimelinesService,
} from 'dipa-api-client';

import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { TemplatesViewControlsService } from './templates-view-controls.service';

@Component({
  selector: 'app-templates-view',
  templateUrl: './templates-view.component.html',
  styleUrls: ['./templates-view.component.scss'],
})
export class TemplatesViewComponent implements OnInit, OnDestroy {
  private static readonly currentTemplateName = 'aktuell';

  @ViewChild('templateChart', { static: true }) template: TemplatesComponent;

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  operationTypesSubscription;
  projectApproachesSubscription;

  vm$: Observable<any>;

  timelineData = [];

  timelinesSubscription;
  activatedRouteSubscription;
  updateTemplateSubscription;

  selectedTimelineId: number;
  selectedProjectApproachId: number;
  selectedOperationTypeId: number;
  selectedOperationTypeName: string;
  selectedProjectApproachName: string;

  selectedTemplatesList = [];
  selectedTemplatesIdList: any[];

  standardTemplatesList = [];
  selectedStandardTemplateIndex: number;

  nonStandardTemplatesList = [];
  selectedNonStandardTemplateIndex: number;

  projectApproachesList: any;

  constructor(
    public templatesViewControlsService: TemplatesViewControlsService,
    public ganttControlsService: GanttControlsService,
    private timelinesService: TimelinesService,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService,
    public activatedRoute: ActivatedRoute,
    private timelineTemplatesService: TimelineTemplatesService
  ) {}

  ngOnInit(): void {
    this.selectedStandardTemplateIndex = null;

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches().subscribe((data) => {
      this.projectApproachesList = data;
    });

    this.activatedRouteSubscription = this.activatedRoute.parent.params.subscribe((param) => {
      this.selectedTimelineId = param.id;

      this.timelinesSubscription = this.timelinesService.getTimelines().subscribe((data) => {
        this.timelineData = data;
        this.setData();

        this.selectedOperationTypeId = this.timelineData.find(
          (item) => item.id === Number(this.selectedTimelineId)
        ).operationTypeId;
        this.selectedProjectApproachId = this.timelineData.find(
          (item) => item.id === Number(this.selectedTimelineId)
        ).projectApproachId;

        this.operationTypesSubscription = this.operationTypesService.getOperationTypes().subscribe((resOperation) => {
          this.selectedOperationTypeName = resOperation.find(
            (item) => item.id === Number(this.selectedOperationTypeId)
          ).name;
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.activatedRouteSubscription?.unsubscribe();
    this.timelinesSubscription?.unsubscribe();
    this.projectApproachesSubscription?.unsubscribe();
    this.operationTypesSubscription?.unsubscribe();
    this.updateTemplateSubscription?.unsubscribe();
  }

  setData(): void {
    this.vm$ = forkJoin([
      this.timelinesService.getTimelines(),
      this.timelineTemplatesService.getTemplatesForTimeline(this.selectedTimelineId),
    ]).pipe(
      map(([timelinesData, templatesData]) => {
        this.selectedTemplatesList = [];

        this.selectedTemplatesList.push(
          templatesData.find((t) => t.name === TemplatesViewComponent.currentTemplateName)
        );

        this.standardTemplatesList = templatesData.filter((t) => t.standard === true);

        this.selectedStandardTemplateIndex = 0;
        this.selectedTemplatesList.push(this.standardTemplatesList[0]);

        this.nonStandardTemplatesList = templatesData.filter((t) => t.standard === false);
        if (this.nonStandardTemplatesList.length > 0) {
          this.selectedNonStandardTemplateIndex = 0;
          this.selectedTemplatesList.push(this.nonStandardTemplatesList[0]);
        }

        const selectedTemplates = this.selectedTemplatesList;
        this.selectedTemplatesIdList = this.selectedTemplatesList.map((t) => t.id);

        const selectedTimeline = timelinesData.find((c) => c.id === Number(this.selectedTimelineId));

        return {
          selectedTimeline,
          selectedTemplates,
          templatesData,
        };
      })
    );
  }

  onPrevStandard(event): void {
    if (this.standardTemplatesList.length > 0) {
      this.selectedStandardTemplateIndex = this.getPrevItemList(
        this.standardTemplatesList,
        this.selectedStandardTemplateIndex
      );

      const id = this.standardTemplatesList[this.selectedStandardTemplateIndex].id;
      this.selectedTemplatesIdList[1] = id;

      this.templatesViewControlsService.setTemplatesList(this.selectedTemplatesIdList);
    }
  }

  onNextStandard(event): void {
    if (this.standardTemplatesList.length > 0) {
      this.selectedStandardTemplateIndex = this.getNextItemList(
        this.standardTemplatesList,
        this.selectedStandardTemplateIndex
      );

      const id = this.standardTemplatesList[this.selectedStandardTemplateIndex].id;
      this.selectedTemplatesIdList[1] = id;

      this.templatesViewControlsService.setTemplatesList(this.selectedTemplatesIdList);
    }
  }

  onPrevNonStandard(event): void {
    if (this.nonStandardTemplatesList.length > 0) {
      this.selectedNonStandardTemplateIndex = this.getPrevItemList(
        this.nonStandardTemplatesList,
        this.selectedNonStandardTemplateIndex
      );

      const id = this.nonStandardTemplatesList[this.selectedNonStandardTemplateIndex].id;
      this.selectedTemplatesIdList[2] = id;

      this.templatesViewControlsService.setTemplatesList(this.selectedTemplatesIdList);
    }
  }

  onNextNonStandard(event): void {
    if (this.nonStandardTemplatesList.length > 0) {
      this.selectedNonStandardTemplateIndex = this.getNextItemList(
        this.nonStandardTemplatesList,
        this.selectedNonStandardTemplateIndex
      );

      const id = this.nonStandardTemplatesList[this.selectedNonStandardTemplateIndex].id;
      this.selectedTemplatesIdList[2] = id;

      this.templatesViewControlsService.setTemplatesList(this.selectedTemplatesIdList);
    }
  }

  getNextItemList(listItems, currentIndex): number {
    if (currentIndex + 1 < listItems.length) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }

    return currentIndex;
  }

  getPrevItemList(listItems, currentIndex): number {
    if (currentIndex - 1 >= 0) {
      currentIndex--;
    } else {
      currentIndex = listItems.length - 1;
    }

    return currentIndex;
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

    if (toggle) {
      const group = toggle.buttonToggleGroup;

      if (event.value.some((item) => item === toggle.value)) {
        group.value = [toggle.value];
      }
      this.templatesViewControlsService.setViewType(group.value[0]);
    } else {
      this.templatesViewControlsService.setViewType(null);
    }
  }

  changeProjectApproach(event): void {
    const selectedTimeline = this.timelineData.find((item) => item.id === Number(this.selectedTimelineId));

    selectedTimeline.projectApproachId = event.value;

    this.timelinesService.updateTimeline(selectedTimeline.id, selectedTimeline).subscribe((d) => {
      this.timelinesSubscription = this.timelinesService.getTimelines().subscribe((data) => {
        this.timelineData = data;

        this.selectedProjectApproachId = this.timelineData.find(
          (item) => item.id === Number(this.selectedTimelineId)
        ).projectApproachId;

        this.setData();
      });
    });
  }

  filterProjectApproaches(): any[] {
    return this.projectApproachesList.filter(
      (projectApproach) => projectApproach.operationTypeId === this.selectedOperationTypeId
    );
  }

  updateTemplateStandard(event): void {
    const templateId = this.standardTemplatesList[this.selectedStandardTemplateIndex].id;

    this.updateTemplateSubscription = this.timelineTemplatesService
      .updateTemplate(this.selectedTimelineId, templateId)
      .subscribe((data) => {
        this.setData();
      });
  }

  updateTemplateNonStandard(event): void {
    const templateId = this.nonStandardTemplatesList[this.selectedNonStandardTemplateIndex].id;

    this.updateTemplateSubscription = this.timelineTemplatesService
      .updateTemplate(this.selectedTimelineId, templateId)
      .subscribe((data) => {
        this.setData();
      });
  }
}
