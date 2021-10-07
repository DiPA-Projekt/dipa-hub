import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../nav-item';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
  public navMenuItems: NavItem[] = [];

  public ngOnInit(): void {
    this.setSideNavMenu();
  }

  private setSideNavMenu(): void {
    this.navMenuItems = [
      {
        name: 'Zeitplankonfigurationen',
        icon: 'date_range',
        route: 'schedules/configuration',
      },
    ];
  }
}
