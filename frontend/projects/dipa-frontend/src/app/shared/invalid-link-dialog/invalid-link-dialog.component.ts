import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
}

@Component({
  selector: 'app-invalid-link-dialog',
  templateUrl: './invalid-link-dialog.component.html',
})
export class InvalidLinkDialogComponent {
  public constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
