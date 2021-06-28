import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Milestone, MilestonesService, Timeline } from 'dipa-api-client';
import { MatSnackBar } from '@angular/material/snack-bar';
import StatusEnum = Milestone.StatusEnum;

@Component({
  selector: 'app-milestone-dialog',
  templateUrl: './milestone-dialog.component.html',
  styleUrls: ['./milestone-dialog.component.scss'],
})
export class MilestoneDialogComponent implements OnInit {
  public formGroup: FormGroup;
  public statusList = [
    {
      value: StatusEnum.Open,
      name: 'offen',
    },
    {
      value: StatusEnum.Done,
      name: 'erledigt',
    },
  ];
  public errorVisible = false;

  public constructor(
    public dialogRef: MatDialogRef<MilestoneDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public timeline: Timeline,
    private fb: FormBuilder,
    private milestoneService: MilestonesService
  ) {}

  private static isMilestoneOutOfProjectPeriod(timeline: Timeline, milestoneDate: Date): boolean {
    const timelineStart = new Date(timeline.start);
    const timelineEnd = new Date(timeline.end);
    return milestoneDate < timelineStart || milestoneDate > timelineEnd;
  }

  public ngOnInit(): void {
    this.setReactiveForm();
  }

  public onSubmit(formGroup: FormGroup): void {
    if (formGroup.valid) {
      this.milestoneService.createMilestone(this.timeline.id, formGroup.value).subscribe({
        next: () => {
          const milestoneDate: Date = formGroup.get('date').value as Date;
          if (MilestoneDialogComponent.isMilestoneOutOfProjectPeriod(this.timeline, milestoneDate)) {
            this.snackBar.open('Der Projektzeitraum wurde erweitert.', 'Schließen', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 4000,
              panelClass: 'lightColorPanel',
            });
          }
          formGroup.reset(formGroup.value);
        },
        error: null,
        complete: () => {
          this.dialogRef.close();
        },
      });
    } else {
      this.errorVisible = true;
    }
  }

  public onCloseClick(): void {
    this.dialogRef.close();
  }

  private setReactiveForm(): void {
    this.formGroup = this.fb.group({
      id: -1,
      name: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      status: new FormControl(StatusEnum.Open, { validators: [Validators.required], updateOn: 'change' }),
      date: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
    });
  }
}
