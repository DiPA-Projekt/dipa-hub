import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvalidLinkDialogComponent } from '../invalid-link-dialog/invalid-link-dialog.component';
import Utils from '../utils';

@Component({
  selector: 'app-external-link',
  templateUrl: './external-link.component.html',
})
export class ExternalLinkComponent {
  @Input() public url: string;
  @Input() public title: string;

  public constructor(public dialog: MatDialog) {}

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
