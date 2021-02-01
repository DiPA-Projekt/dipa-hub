import { Component, ViewChild } from '@angular/core';
import { GanttMenuComponent } from './menus/gantt-menu/gantt-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(GanttMenuComponent) ganttMenuComponent: GanttMenuComponent;
  title = 'dipa-frontend';
}
