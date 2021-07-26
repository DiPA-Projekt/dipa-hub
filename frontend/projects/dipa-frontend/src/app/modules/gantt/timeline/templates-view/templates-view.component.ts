import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GanttControlsService } from '../../gantt-controls.service';
import { TemplatesComponent } from './templates/templates.component';

import {
  OperationTypesService,
  ProjectApproachesService,
  TimelineTemplatesService,
  TimelineTemplate,
  Timeline,
  TimelinesService,
} from 'dipa-api-client';

import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { TemplatesViewControlsService } from './templates-view-controls.service';
import { MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { switchMap } from 'rxjs/operators';
import { TimelineDataService } from '../../../../shared/timelineDataService';

@Component({
  selector: 'app-templates-view',
  templateUrl: './templates-view.component.html',
  styleUrls: ['./templates-view.component.scss'],
})
export class TemplatesViewComponent implements OnInit, OnDestroy {
  private static readonly currentTemplateName = 'aktuell';

  @ViewChild('templateChart', { static: true }) public template: TemplatesComponent;

  public periodStartDate = new Date(2020, 0, 1);
  public periodEndDate = new Date(2020, 11, 31);

  public vm$: Observable<any>;

  public timelineData: Timeline[] = [];

  public selectedTimelineId: number;
  public selectedOperationTypeId: number;

  public selectedTemplatesList: TimelineTemplate[] = [];
  public standardTemplatesList: TimelineTemplate[] = [];
  public nonStandardTemplatesList: TimelineTemplate[] = [];

  private selectedTemplatesIdList: any[];
  private selectedStandardTemplateIndex: number;
  private selectedNonStandardTemplateIndex: number;

  private timelineDataSubscription: Subscription;
  private timelinesSubscription: Subscription;
  private activatedRouteSubscription: Subscription;
  private updateTemplateSubscription: Subscription;

  public constructor(
    public templatesViewControlsService: TemplatesViewControlsService,
    public ganttControlsService: GanttControlsService,
    private timelineDataService: TimelineDataService,
    private timelinesService: TimelinesService,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService,
    public activatedRoute: ActivatedRoute,
    private timelineTemplatesService: TimelineTemplatesService
  ) {}

  public ngOnInit(): void {
    this.selectedStandardTemplateIndex = null;

    this.timelinesSubscription = this.activatedRoute.parent.parent.params
      .pipe(
        switchMap((params: Params): Observable<Timeline[]> => {
          this.selectedTimelineId = parseInt(params.id, 10);
          return this.timelinesService.getTimelines();
        })
      )
      .subscribe((data: Timeline[]) => {
        this.timelineData = data;

        this.setData();

        this.selectedOperationTypeId = this.timelineData.find(
          (item) => item.id === Number(this.selectedTimelineId)
        ).operationTypeId;
      });

    this.timelineDataSubscription = this.timelineDataService.getTimelines().subscribe(() => {
      this.setData();
    });
  }

  public ngOnDestroy(): void {
    this.activatedRouteSubscription?.unsubscribe();
    this.timelineDataSubscription?.unsubscribe();
    this.timelinesSubscription?.unsubscribe();
    this.updateTemplateSubscription?.unsubscribe();
  }

  public setData(): void {
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
        this.selectedTemplatesIdList = this.selectedTemplatesList.map((t: TimelineTemplate) => t.id);

        const selectedTimeline = timelinesData.find((c) => c.id === Number(this.selectedTimelineId));

        return {
          selectedTimeline,
          selectedTemplates,
          templatesData,
        };
      })
    );
  }

  public onPrevStandard(): void {
    if (this.standardTemplatesList.length > 0) {
      this.selectedStandardTemplateIndex = this.getPrevItemList(
        this.standardTemplatesList,
        this.selectedStandardTemplateIndex
      );

      this.selectedTemplatesIdList[1] = this.standardTemplatesList[this.selectedStandardTemplateIndex].id;

      this.templatesViewControlsService.setTemplatesList(this.selectedTemplatesIdList);
    }
  }

  public onNextStandard(): void {
    if (this.standardTemplatesList.length > 0) {
      this.selectedStandardTemplateIndex = this.getNextItemList(
        this.standardTemplatesList,
        this.selectedStandardTemplateIndex
      );

      this.selectedTemplatesIdList[1] = this.standardTemplatesList[this.selectedStandardTemplateIndex].id;

      this.templatesViewControlsService.setTemplatesList(this.selectedTemplatesIdList);
    }
  }

  public onPrevNonStandard(): void {
    if (this.nonStandardTemplatesList.length > 0) {
      this.selectedNonStandardTemplateIndex = this.getPrevItemList(
        this.nonStandardTemplatesList,
        this.selectedNonStandardTemplateIndex
      );

      this.selectedTemplatesIdList[2] = this.nonStandardTemplatesList[this.selectedNonStandardTemplateIndex].id;

      this.templatesViewControlsService.setTemplatesList(this.selectedTemplatesIdList);
    }
  }

  public onNextNonStandard(): void {
    if (this.nonStandardTemplatesList.length > 0) {
      this.selectedNonStandardTemplateIndex = this.getNextItemList(
        this.nonStandardTemplatesList,
        this.selectedNonStandardTemplateIndex
      );

      this.selectedTemplatesIdList[2] = this.nonStandardTemplatesList[this.selectedNonStandardTemplateIndex].id;

      this.templatesViewControlsService.setTemplatesList(this.selectedTemplatesIdList);
    }
  }

  public getNextItemList(listItems: TimelineTemplate[], currentIndex: number): number {
    if (currentIndex + 1 < listItems.length) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }

    return currentIndex;
  }

  public getPrevItemList(listItems: TimelineTemplate[], currentIndex: number): number {
    if (currentIndex - 1 >= 0) {
      currentIndex--;
    } else {
      currentIndex = listItems.length - 1;
    }

    return currentIndex;
  }

  public changeViewType(event: MatButtonToggleChange): void {
    const toggle = event.source;

    if (toggle) {
      const group: MatButtonToggleGroup = toggle.buttonToggleGroup;

      const selectedValue = toggle.value as string;

      if ((event.value as string[]).some((item: string) => item === selectedValue)) {
        group.value = [selectedValue];
        this.templatesViewControlsService.setViewType(selectedValue);
      }
    } else {
      this.templatesViewControlsService.setViewType(null);
    }
  }

  public updateTemplateStandard(): void {
    const templateId = this.standardTemplatesList[this.selectedStandardTemplateIndex].id;

    this.updateTemplateSubscription = this.timelineTemplatesService
      .updateTimelineTemplate(this.selectedTimelineId, templateId)
      .subscribe(() => {
        this.setData();
      });
  }

  public updateTemplateNonStandard(): void {
    const templateId = this.nonStandardTemplatesList[this.selectedNonStandardTemplateIndex].id;

    this.updateTemplateSubscription = this.timelineTemplatesService
      .updateTimelineTemplate(this.selectedTimelineId, templateId)
      .subscribe(() => {
        this.setData();
      });
  }
}
