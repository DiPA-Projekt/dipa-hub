import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Timeline, TimelinesService } from 'dipa-api-client';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-gantt-menu',
  templateUrl: './gantt-menu.component.html',
  exportAs: 'gantMenuComponent',
})
export class GanttMenuComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenu, { static: true }) public menu: MatMenu;

  public timelineData: Timeline[];

  private timelinesSubscription: Subscription;
  private currentUserId: number;

  public constructor(
    private timelinesService: TimelinesService,
    private authenticationService: AuthenticationService
  ) {}

  public ngOnInit(): void {
    this.timelinesSubscription = this.timelinesService.getTimelines().subscribe((data) => {
      const userProjectIds: number[] = [];
      this.authenticationService.getUserData().subscribe((user) => (this.currentUserId = user.id));
      this.authenticationService.getProjectRoles().forEach((role) => userProjectIds.push(role.projectId));
      this.timelineData = data.filter((t) => userProjectIds.includes(t.id));
      data.forEach((t) => {
        if (!this.timelineData.includes(t)) {
          this.timelineData.push(t);
        }
      });
    });
  }

  public ngOnDestroy(): void {
    this.timelinesSubscription?.unsubscribe();
  }
}
