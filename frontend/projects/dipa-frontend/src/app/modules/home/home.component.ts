import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../nav-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public navMenuItems: NavItem[] = [];

  public ngOnInit(): void {
    this.setSideNavMenu();
  }

  private setSideNavMenu(): void {
    this.navMenuItems = [
      {
        name: 'Eine Reise durchs Projekt',
        icon: 'explore',
        url: 'home/tour',
        isRoute: true,
      },
      {
        name: 'Produktvorlagen',
        icon: 'content_copy',
        url: 'home/product-templates',
        isRoute: true,
      },
      {
        name: 'Nützliche Links',
        icon: 'bookmarks',
        url: 'home/links',
        isRoute: true,
      },
    ];
  }
}
