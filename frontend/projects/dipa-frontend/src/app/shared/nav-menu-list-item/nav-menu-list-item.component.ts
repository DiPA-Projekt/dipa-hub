import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {NavItem} from '../../nav-item';
import {NavService} from '../../nav.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {FilesService} from 'dipa-api-client';

@Component({
  selector: 'app-nav-menu-list-item',
  templateUrl: './nav-menu-list-item.component.html',
  styleUrls: ['./nav-menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('250ms cubic-bezier(0.42,0,0.58,1)')
      )
    ])
  ]
})
export class NavMenuListItemComponent implements OnInit {

  expanded: boolean;
  baseApiPath: string;
  @HostBinding('attr.aria-expanded') ariaExpanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(public navService: NavService,
              private fileService: FilesService,
              public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit(): void {

    this.expanded = false;
    this.ariaExpanded = this.expanded;
    this.baseApiPath = this.fileService.configuration.basePath;

    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });
  }

  onItemSelected(item: NavItem): void {
    if (!item.children || !item.children.length) {

      if (item.route) {
        this.router.navigate([item.route]);
      } else if (item.url) {
        window.open(item.url, '_blank');
      }
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

}
