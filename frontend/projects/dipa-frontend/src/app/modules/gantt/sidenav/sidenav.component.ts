import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavItem } from '../../../nav-item';
import { ExternalLinksService, Timeline, Project, TimelinesService, ProjectService } from 'dipa-api-client';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../authentication.service';
import { TimelineDataService } from '../../../shared/timelineDataService';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  public timelineData: Timeline[] = [];

  public timeline: Timeline;

  public selectedTimelineId: number;

  public navMenuItems: NavItem[] = [];
  public favoriteLinkItems: NavItem[] = [];
  public roles: string;

  private favoriteLinksSubscription: Subscription;
  private rolesSubscription: Subscription;
  private timelineDataSubscription: Subscription;
  private paramsSubscription: Subscription;
  private projectSubscription: Subscription;
  private project: Project;

  public constructor(
    private authenticationService: AuthenticationService,
    private timelinesService: TimelinesService,
    private externalLinksService: ExternalLinksService,
    private activatedRoute: ActivatedRoute,
    private timelineDataService: TimelineDataService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.selectedTimelineId = parseInt(params.id, 10);
      this.timelineDataService.setTimelines();
      this.timelineDataService.setRoles(this.selectedTimelineId);
    });

    this.timelineDataSubscription = this.timelineDataService.getTimelines().subscribe((data) => {
      if (data !== null) {
        this.timeline = data.find((c) => c.id === Number(this.selectedTimelineId));
        this.setSideNavMenu();
      }
    });

    this.rolesSubscription = this.timelineDataService.getRoles().subscribe((data) => {
      this.roles = data;
    });

    this.projectSubscription = this.projectService.getProjectData(this.selectedTimelineId).subscribe((data) => {
      this.project = data;
    });
  }

  public ngOnDestroy(): void {
    this.favoriteLinksSubscription?.unsubscribe();
    this.paramsSubscription?.unsubscribe();
    this.timelineDataSubscription?.unsubscribe();
    this.rolesSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
  }

  public setSideNavMenu(): void {
    this.navMenuItems = [
      {
        name: 'Unsere Reise durchs Projekt',
        icon: 'directions_walk',
        route: `gantt/${this.selectedTimelineId}/project-checklist`,
        children: [
          {
            name: 'Schnellstart Projektmanagement (Planung)',
            icon: 'play_arrow',
            route: `gantt/${this.selectedTimelineId}/project-checklist/quickstart`,
          },
          {
            name: 'Umsetzung und Steuerung',
            icon: 'build',
            route: `gantt/${this.selectedTimelineId}/project-checklist/control`,
          },
          {
            name: 'Abschluss',
            icon: 'outlined_flag',
            route: `gantt/${this.selectedTimelineId}/project-checklist/end`,
          },
        ],
      },
      {
        name: 'Unser Zeitplan',
        icon: 'calendar_today',
        route: `gantt/${this.selectedTimelineId}/timeline`,
        children: [
          {
            name: 'Unsere Aufgaben',
            icon: 'list_alt',
            route: `gantt/${this.selectedTimelineId}/timeline/tasks`,
          },
          {
            name: 'Unsere Termine',
            icon: 'event_note',
            route: `gantt/${this.selectedTimelineId}/timeline/schedules`,
          },
          {
            name: 'Stöbern & Vergleichen',
            icon: 'find_replace',
            route: `gantt/${this.selectedTimelineId}/timeline/templates`,
          },
        ],
      },
      {
        name: 'Unsere Projektorganisation',
        icon: 'person_add_alt_1',
        route: `gantt/${this.selectedTimelineId}/project-organization`,
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

  public archiveProject(): void {
    this.project.archived = true;

    this.projectService.updateProjectData(this.selectedTimelineId, this.project).subscribe({
      next: () => {
        this.timelineDataService.setTimelines();
        this.router.navigate([`overview/archivedProjects`], {
          fragment: `gantt${this.selectedTimelineId}`,
        });
      },
      error: null,
      complete: () => void 0,
    });
  }
}
