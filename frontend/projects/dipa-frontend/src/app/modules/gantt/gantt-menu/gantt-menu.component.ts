import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatMenu} from '@angular/material/menu';
import { TimelinesService } from 'dipa-api-client';

@Component({
  selector: 'app-gantt-menu',
  templateUrl: './gantt-menu.component.html',
  styleUrls: ['./gantt-menu.component.scss'],
  exportAs: 'menuComponent'
})
export class GanttMenuComponent implements OnInit {
  @ViewChild(MatMenu, {static: true}) menu: MatMenu;

  constructor(private timelinesService: TimelinesService) { }
  private timelinesSubscription;
  public timelineData;

  ngOnInit(): void {
    this.timelinesSubscription = this.timelinesService.getTimelines()
    .subscribe((data) => {
      this.timelineData = data;
    });
  }

}
