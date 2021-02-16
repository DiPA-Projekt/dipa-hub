import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Timeline, TimelinesService } from 'dipa-api-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gantt-menu',
  templateUrl: './gantt-menu.component.html',
  styleUrls: ['./gantt-menu.component.scss'],
  exportAs: 'menuComponent',
})
export class GanttMenuComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenu, { static: true }) menu: MatMenu;

  public timelineData: Timeline[];

  private timelinesSubscription: Subscription;

  constructor(private timelinesService: TimelinesService) {}

  ngOnInit(): void {
    this.timelinesSubscription = this.timelinesService.getTimelines().subscribe((data) => {
      this.timelineData = data;
    });
  }

  ngOnDestroy(): void {
    this.timelinesSubscription?.unsubscribe();
  }
}
