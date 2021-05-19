import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Milestone, MilestonesService, Timeline } from 'dipa-api-client';
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
    @Inject(MAT_DIALOG_DATA) public timeline: Timeline,
    private fb: FormBuilder,
    private milestoneService: MilestonesService
  ) {}

  public ngOnInit(): void {
    this.setReactiveForm();
  }

  public onSubmit(formGroup: FormGroup): void {
    if (formGroup.valid) {
      this.milestoneService.createMilestone(this.timeline.id, formGroup.value).subscribe({
        next: () => formGroup.reset(formGroup.value),
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
      status: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      date: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
    });
  }
}
