import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavItem } from '../../nav-item';
import { NavService } from '../../nav.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { FilesService } from 'dipa-api-client';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-nav-menu-list-item',
  templateUrl: './nav-menu-list-item.component.html',
  styleUrls: ['./nav-menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate('250ms cubic-bezier(0.42,0,0.58,1)')),
    ]),
  ],
})
export class NavMenuListItemComponent implements OnInit {
  @Input() public item: NavItem;
  @Input() public depth: number;
  @HostBinding('attr.aria-expanded') private ariaExpanded;

  public expanded: boolean;
  public baseApiPath: string;

  public constructor(public navService: NavService, public router: Router, private filesService: FilesService) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  public ngOnInit(): void {
    this.expanded = this.item.children?.filter((child) => this.router.isActive(child.url, true)).length > 0;

    this.ariaExpanded = this.expanded;
    this.baseApiPath = this.filesService.configuration.basePath;

    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.isRoute && url) {
        this.expanded = url.indexOf(`/${this.item.url}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });
  }

  public onItemSelected(item: NavItem): void {
    if (!item.children || !item.children.length) {
      if (item.isRoute) {
        void this.router.navigate([item.url]);
      } else if (item.isFile) {
        this.getDownloadFile(item);
      } else if (item.url) {
        window.open('/' + item.url, '_blank');
      }
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  public getDownloadFile(item: NavItem): void {
    this.filesService.getFile(item.id, 'response').subscribe((response: HttpResponse<Blob>) => {
      let filename;

      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = fileNameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const dataType = 'arraybuffer';
      const binaryData = [response.body];
      // use a temporary link with document-attribute for naming file
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      if (filename) {
        downloadLink.setAttribute('download', filename);
      }
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    });
  }

  public auxClick(event: MouseEvent): void {
    if (event.button === 1) {
      event.preventDefault();
      const a = event.currentTarget as HTMLLinkElement;
      const newTab = window.open(a.href, '_blank');
      newTab.focus();
    }
  }

  public routerLink(item: NavItem): string[] {
    if (!item.isRoute) {
      return null;
    }
    const splittedUrl = item.url?.split('/') || [];
    return ['/', ...splittedUrl];
  }
}
