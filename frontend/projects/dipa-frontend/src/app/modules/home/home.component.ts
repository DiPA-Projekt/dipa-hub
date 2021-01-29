import {Component, OnInit} from '@angular/core';
import {NavItem} from '../../nav-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  navMenuItems: NavItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.setSideNavMenu();
  }

  setSideNavMenu(): void {

    this.navMenuItems = [{
      name: 'Eine Reise durchs Projekt',
      icon: 'explore',
      route: 'home/tour'
    }, {
      name: 'Nützliche Links',
      icon: 'bookmarks',
      route: 'home/links'
    }];
  }

}
