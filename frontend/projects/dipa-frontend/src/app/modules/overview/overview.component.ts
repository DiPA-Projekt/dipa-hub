import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../nav-item';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  navMenuItems: NavItem[] = [];

  ngOnInit(): void {
    this.setSideNavMenu();
  }

  setSideNavMenu(): void {
    this.navMenuItems = [
      {
        name: 'Projektübersicht',
        icon: 'library_books',
        route: 'overview/projects',
      },
    ];
  }
}
