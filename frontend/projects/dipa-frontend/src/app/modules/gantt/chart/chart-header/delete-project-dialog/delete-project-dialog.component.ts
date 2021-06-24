import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService, Timeline } from 'dipa-api-client';
import { ChartHeaderComponent } from '../chart-header.component';

@Component({
  selector: 'app-delete-project-dialog',
  templateUrl: './delete-project-dialog.component.html',
  styleUrls: ['./delete-project-dialog.component.scss'],
})
export class DeleteProjectDialogComponent {
  public onDelete = new EventEmitter();

  public constructor(
    public dialogRef: MatDialogRef<ChartHeaderComponent>,
    @Inject(MAT_DIALOG_DATA) public timelineData: Timeline,
    private projectService: ProjectService
  ) {}

  public deleteProject(): void {
    this.projectService.deleteProject(this.timelineData.id).subscribe({
      next: () => this.onDelete.emit(),
      error: null,
      complete: () => this.dialogRef.close(),
    });
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
