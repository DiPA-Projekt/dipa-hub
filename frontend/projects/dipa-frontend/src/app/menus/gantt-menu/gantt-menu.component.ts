import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Timeline, User, UserService } from 'dipa-api-client';
import { Subscription, Observable } from 'rxjs';
import { TimelineDataService } from '../../shared/timelineDataService';
import { filter, switchMap } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-gantt-menu',
  templateUrl: './gantt-menu.component.html',
  exportAs: 'gantMenuComponent',
})
export class GanttMenuComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenu, { static: true }) public menu: MatMenu;

  public timelineData: Timeline[];

  public url: string;

  private timelinesSubscription: Subscription;
  private timelines: Timeline[];

  private urlSubscription: Subscription;

  public constructor(
    private userService: UserService,
    private timelineDataService: TimelineDataService,
    private router: Router
  ) {}

  private static getUrl(pathname: string): string {
    const regexp = /gantt\/\d\/(?<path>.*)/;
    const groups = regexp.exec(pathname)?.groups;
    return groups?.path;
  }

  public ngOnInit(): void {
    this.url = GanttMenuComponent.getUrl(window.location.pathname);

    this.urlSubscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe((data: NavigationStart) => {
        this.url = GanttMenuComponent.getUrl(data.url);
      });

    this.timelinesSubscription = this.timelineDataService
      .getTimelines()
      .pipe(
        switchMap((timelines: Timeline[]): Observable<User> => {
          this.timelines = timelines?.filter((timeline) => !timeline.archived);
          return this.userService.getCurrentUser();
        })
      )
      .subscribe({
        next: (user: User) => {
          const userProjectIds: number[] = [];
          user.projectRoles
            .filter((role) => role.abbreviation !== 'PMO')
            .forEach((role) => userProjectIds.push(role.projectId));
          if (this.timelines !== null) {
            this.timelineData = this.timelines?.filter((t) => userProjectIds.includes(t.id));
            this.timelineData?.sort((a, b) => a.name.localeCompare(b.name));
          }
        },
        error: null,
        complete: () => void 0,
      });
  }

  public ngOnDestroy(): void {
    this.urlSubscription?.unsubscribe();
    this.timelinesSubscription?.unsubscribe();
  }

  public auxClick(event: MouseEvent): void {
    if (event.button === 1) {
      event.preventDefault();
      const a = event.target as HTMLLinkElement;
      const newTab = window.open(a.href, '_blank');
      newTab.focus();
    }
  }

  public routerLink(id: number): string[] {
    const splittedUrl = this.url?.split('/') || ['project-checklist'];
    return ['/gantt/', id.toString(), ...splittedUrl];
  }
}
