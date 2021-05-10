import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavItem } from '../../../nav-item';
import { ExternalLinksService, Timeline, TimelinesService } from 'dipa-api-client';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../../../authentication.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  public timelineData: Timeline[] = [];

  public timeline: Timeline;

  public selectedTimelineId: number;

  public favoriteLinksSubscription: Subscription;
  public timelinesSubscription: Subscription;

  public navMenuItems: NavItem[] = [];
  public favoriteLinkItems: NavItem[] = [];
  public roles: string;

  public constructor(
    private authenticationService: AuthenticationService,
    private timelinesService: TimelinesService,
    private externalLinksService: ExternalLinksService,
    public activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.timelinesSubscription = this.activatedRoute.params
      .pipe(
        switchMap(
          (params: Params): Observable<Timeline[]> => {
            this.selectedTimelineId = parseInt(params.id, 10);
            return this.timelinesService.getTimelines();
          }
        )
      )
      .subscribe((data: Timeline[]) => {
        this.timelineData = data;
        this.timeline = this.timelineData.find((c) => c.id === Number(this.selectedTimelineId));

        this.setSideNavMenu();
      });
  }

  public ngOnDestroy(): void {
    this.favoriteLinksSubscription?.unsubscribe();
    this.timelinesSubscription?.unsubscribe();
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
        name: 'Zeitplan',
        icon: 'event_note',
        route: `gantt/${this.selectedTimelineId}/timeline`,
      },
      {
        name: 'Stöbern & Vergleichen',
        icon: 'find_replace',
        route: `gantt/${this.selectedTimelineId}/templates`,
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
    this.roles = this.authenticationService.getCurrentUserProjectRoles(this.timeline);
  }
}
