import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Timeline, User, UserService } from 'dipa-api-client';
import { Subscription, Observable } from 'rxjs';
import { TimelineDataService } from '../../shared/timelineDataService';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-gantt-menu',
  templateUrl: './gantt-menu.component.html',
  exportAs: 'gantMenuComponent',
})
export class GanttMenuComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenu, { static: true }) public menu: MatMenu;

  public timelineData: Timeline[];

  private timelinesSubscription: Subscription;
  private timelines: Timeline[];
  public constructor(private userService: UserService, private timelineDataService: TimelineDataService) {}

  public ngOnInit(): void {
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
    this.timelinesSubscription?.unsubscribe();
  }
}
