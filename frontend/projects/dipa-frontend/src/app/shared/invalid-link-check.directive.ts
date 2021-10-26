import { Directive, Input, HostListener, EventEmitter, Output } from '@angular/core';
import Utils from './utils';
import { InvalidLinkDialogComponent } from './invalid-link-dialog/invalid-link-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Directive({
  selector: '[appInvalidLinkCheck]',
})
export class InvalidLinkCheckDirective {
  @Output() public myClick: EventEmitter<any> = new EventEmitter();
  @Input() private href: string;
  @Input() private isExternalLink;

  public constructor(public dialog: MatDialog) {}

  @HostListener('click', ['$event'])
  private clickHandler(e: MouseEvent): void {
    if (this.isExternalLink && this.href !== null) {
      if (!this.checkValidUrl(this.href)) {
        e.preventDefault();
        this.openInvalidUrlModal(this.href);
      } else {
        const newTab = window.open(this.href, '_blank');
        newTab.focus();
      }
    } else {
      this.myClick.next(e);
    }
  }

  public checkValidUrl(url: string): boolean {
    return Utils.isValidUrl(url);
  }

  public openInvalidUrlModal(urlTitle: string): void {
    this.dialog.open(InvalidLinkDialogComponent, {
      data: {
        title: urlTitle,
      },
    });
  }
}
