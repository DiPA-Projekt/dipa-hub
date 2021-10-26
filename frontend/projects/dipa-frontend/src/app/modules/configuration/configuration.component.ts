import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../nav-item';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
  public navMenuItems: NavItem[] = [];

  public ngOnInit(): void {
    this.setSideNavMenu();
  }

  private setSideNavMenu(): void {
    this.navMenuItems = [
      {
        name: 'Zeitplankonfiguration',
        icon: 'date_range',
        route: 'configuration/schedules',
      },
      {
        name: 'Wiederkehrende Aufgaben',
        icon: 'change_circle',
        route: 'configuration/recurring_events',
      },
    ];
  }
}
