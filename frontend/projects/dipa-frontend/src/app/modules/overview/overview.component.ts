import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../nav-item';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  public navMenuItems: NavItem[] = [];

  public ngOnInit(): void {
    this.setSideNavMenu();
  }

  private setSideNavMenu(): void {
    this.navMenuItems = [
      {
        name: 'Aktive Projekte',
        icon: 'library_books',
        url: 'overview/projects',
        isRoute: true,
      },
      {
        name: 'Archivierte Projekte',
        icon: 'inventory',
        url: 'overview/archivedProjects',
        isRoute: true,
      },
    ];
  }
}
