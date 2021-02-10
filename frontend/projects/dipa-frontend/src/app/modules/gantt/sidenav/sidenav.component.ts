import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavItem } from '../../../nav-item';
import { ExternalLinksService, Timeline, TimelinesService } from 'dipa-api-client';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  timelineData: Timeline[] = [];

  timeline: Timeline;

  selectedTimelineId: number;

  favoriteLinksSubscription: Subscription;
  timelinesSubscription: Subscription;

  navMenuItems: NavItem[] = [];
  favoriteLinkItems: NavItem[] = [];

  constructor(
    private timelinesService: TimelinesService,
    private externalLinksService: ExternalLinksService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.favoriteLinksSubscription?.unsubscribe();
    this.timelinesSubscription?.unsubscribe();
  }

  setSideNavMenu(): void {
    this.navMenuItems = [
      {
        name: 'Deine Reise durchs Projekt',
        icon: 'directions_walk',
        route: `gantt/${this.selectedTimelineId}/project-checklist`,
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
    ];

    // this.favoriteLinksSubscription = this.externalLinksService.getFavoriteLinks().subscribe((data) => {
    //   this.favoriteLinkItems = [
    //     {
    //       name: 'Favoriten-Links',
    //       icon: 'bookmarks',
    //       children: data.map((x) => ({
    //         name: x.name,
    //         icon: 'star',
    //         url: x.url,
    //       })),
    //     },
    //   ];
    // });
  }
}
