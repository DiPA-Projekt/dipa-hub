import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transfer-team-data-dialog',
  templateUrl: './transfer-team-data-dialog.component.html',
})
export class TransferTeamDataDialogComponent {
  public constructor(
    public dialogRef: MatDialogRef<TransferTeamDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public onSubmit(): void {
    console.log(this.data);
  }

  public onCloseClick(): void {
    this.dialogRef.close();
  }
}
