import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavItem } from '../../../nav-item';
import {
  ExternalLinksService,
  Timeline,
  Project,
  TimelinesService,
  OperationTypesService,
  ProjectApproachesService,
  OperationType,
  ProjectApproach,
} from 'dipa-api-client';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../../../authentication.service';
import { TimelineDataService } from '../../../shared/timelineDataService';
import { ProjectSettingsDialogComponent } from '../project-settings-dialog/project-settings-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

interface KeyValuePair {
  key: string;
  value: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  public timelineData: Timeline[] = [];

  public timeline: Timeline;

  public selectedTimelineId: number;

  public operationTypesList: Array<OperationType> = [];
  public projectApproachesList: Array<ProjectApproach> = [];

  public project: Project;

  public navMenuItems: NavItem[] = [];
  public favoriteLinkItems: NavItem[] = [];
  public roles: string;

  public projectDetailsDisplayedColumns = ['key', 'value'];
  public projectDetailsDataSource = new MatTableDataSource();

  private favoriteLinksSubscription: Subscription;
  private rolesSubscription: Subscription;
  private timelineDataSubscription: Subscription;
  private paramsSubscription: Subscription;
  private operationTypesSubscription: Subscription;
  private projectApproachesSubscription: Subscription;

  public constructor(
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private timelinesService: TimelinesService,
    private externalLinksService: ExternalLinksService,
    private activatedRoute: ActivatedRoute,
    private timelineDataService: TimelineDataService,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService
  ) {}

  public ngOnInit(): void {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.selectedTimelineId = parseInt(params.id, 10);
      this.timelineDataService.setTimelines();
      this.timelineDataService.setRoles(this.selectedTimelineId);
    });

    this.operationTypesSubscription = this.operationTypesService.getOperationTypes().subscribe((data) => {
      this.operationTypesList = data;
    });

    this.projectApproachesSubscription = this.projectApproachesService.getProjectApproaches().subscribe((data) => {
      this.projectApproachesList = data;
    });

    this.timelineDataSubscription = this.timelineDataService
      .getTimelines()
      .pipe(
        switchMap((data: Timeline[]): Observable<Project> => {
          if (data !== null) {
            this.timeline = data.find((c) => c.id === Number(this.selectedTimelineId));
            this.setSideNavMenu();
          }
          this.timelineDataService.setProjectData(this.selectedTimelineId);
          return this.timelineDataService.getProjectData();
        })
      )
      .subscribe((data: Project) => {
        this.project = data;

        const keyValues: KeyValuePair[] = [];
        keyValues.push({ key: 'Eigene Rolle', value: this.roles });
        keyValues.push({ key: 'Projektnummer', value: this.project?.akz || '-' });
        keyValues.push({ key: 'Projektart', value: this.timeline?.projectType || '-' });
        keyValues.push({
          key: 'Vorgehensweise',
          value: this.getProjectApproach(this.timeline?.projectApproachId)?.name || '-',
        });

        this.projectDetailsDataSource.data = keyValues;
      });

    this.rolesSubscription = this.timelineDataService.getRoles().subscribe((data) => {
      this.roles = data;
    });
  }

  public ngOnDestroy(): void {
    this.favoriteLinksSubscription?.unsubscribe();
    this.paramsSubscription?.unsubscribe();
    this.timelineDataSubscription?.unsubscribe();
    this.rolesSubscription?.unsubscribe();
    this.operationTypesSubscription?.unsubscribe();
    this.projectApproachesSubscription?.unsubscribe();
  }

  public setSideNavMenu(): void {
    this.navMenuItems = [
      {
        name: 'Unsere Reise durchs Projekt',
        icon: 'directions_walk',
        url: `gantt/${this.selectedTimelineId}/project-checklist`,
        isRoute: true,
        children: [
          {
            name: 'Projektübersicht',
            icon: 'dashboard',
            url: `gantt/${this.selectedTimelineId}/project-checklist/dashboard`,
            isRoute: true,
          },
          {
            name: 'Schnellstart Projektmanagement (Planung)',
            icon: 'play_arrow',
            url: `gantt/${this.selectedTimelineId}/project-checklist/quickstart`,
            isRoute: true,
          },
          {
            name: 'Umsetzung und Steuerung',
            icon: 'build',
            url: `gantt/${this.selectedTimelineId}/project-checklist/control`,
            isRoute: true,
          },
          {
            name: 'Abschluss',
            icon: 'flag',
            url: `gantt/${this.selectedTimelineId}/project-checklist/end`,
            isRoute: true,
          },
        ],
      },
      {
        name: 'Unser Zeitplan',
        icon: 'calendar_today',
        url: `gantt/${this.selectedTimelineId}/timeline`,
        isRoute: true,
        children: [
          {
            name: 'Unsere Aufgaben',
            icon: 'list_alt',
            url: `gantt/${this.selectedTimelineId}/timeline/tasks`,
            isRoute: true,
          },
          {
            name: 'Unsere Termine',
            icon: 'event_note',
            url: `gantt/${this.selectedTimelineId}/timeline/schedules`,
            isRoute: true,
          },
          {
            name: 'Stöbern & Vergleichen',
            icon: 'find_replace',
            url: `gantt/${this.selectedTimelineId}/timeline/templates`,
            isRoute: true,
          },
        ],
      },
      {
        name: 'Unsere Projektorganisation',
        icon: 'person_add_alt_1',
        url: `gantt/${this.selectedTimelineId}/project-organization`,
        isRoute: true,
      },
    ];

    this.favoriteLinksSubscription = this.externalLinksService.getFavoriteLinks().subscribe((data) => {
      this.favoriteLinkItems = [
        {
          name: 'Favoriten-Links',
          icon: 'bookmarks',
          children: data.map((x) => ({
            name: x.name,
            icon: 'star',
            url: x.url,
          })),
        },
      ];
    });
  }

  public openProjectSettingsDialog(project: Project, timeline: Timeline): void {
    this.dialog.open(ProjectSettingsDialogComponent, {
      data: { project, timeline },
      height: '80vh',
      width: '80vw',
    });
  }

  public getOperationType(operationTypeId: number): OperationType {
    return this.operationTypesList.filter((operationType) => operationType.id === operationTypeId)[0];
  }

  public getProjectApproach(projectApproachTypeId: number): ProjectApproach {
    return this.projectApproachesList.filter((projectApproach) => projectApproach.id === projectApproachTypeId)[0];
  }
}
