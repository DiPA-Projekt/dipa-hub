import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavItem } from '../../../nav-item';
import { ExternalLinksUserService, Timeline, TimelinesService } from 'dipa-api-client';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  timelineData = [];

  timeline: Timeline;

  selectedTimelineId: number;

  activatedRouteSubscription;
  favoriteLinksSubscription;
  timelinesSubscription;

  navMenuItems: NavItem[] = [];
  favoriteLinkItems: NavItem[] = [];

  constructor(
    private timelinesService: TimelinesService,
    private externalLinksUserService: ExternalLinksUserService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe((param) => {
      this.selectedTimelineId = param.id;
      this.timelinesSubscription = this.timelinesService.getTimelines().subscribe((data) => {
        this.timelineData = data;

        this.timeline = this.timelineData.find((c) => c.id === Number(this.selectedTimelineId));
        this.setSideNavMenu();
      });
    });
  }

  ngOnDestroy(): void {
    this.activatedRouteSubscription?.unsubscribe();
    this.favoriteLinksSubscription?.unsubscribe();
    this.timelinesSubscription?.unsubscribe();
  }

  setSideNavMenu(): void {
    this.navMenuItems = [
      {
        name: 'Deine Reise durchs Projekt',
        icon: 'directions_walk',
        route: 'gantt/' + this.selectedTimelineId + '/project-checklist',
      },
      {
        name: 'Zeitplan',
        icon: 'event_note',
        route: 'gantt/' + this.selectedTimelineId + '/timeline',
      },
      {
        name: 'Stöbern & Vergleichen',
        icon: 'find_replace',
        route: 'gantt/' + this.selectedTimelineId + '/templates',
      },
    ];

    this.favoriteLinksSubscription = this.externalLinksUserService.getFavoriteLinks().subscribe((data) => {
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
}
