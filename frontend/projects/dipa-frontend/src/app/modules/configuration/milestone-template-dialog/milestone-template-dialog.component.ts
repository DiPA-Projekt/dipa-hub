import { Component, EventEmitter, Inject, OnDestroy, Output, ViewChild } from '@angular/core';
import { MilestoneTemplateFormComponent } from '../milestone-template-form/milestone-template-form.component';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationService, MilestoneTemplate, PlanTemplate } from 'dipa-api-client';
import { ConfigurationDataService } from '../../../shared/configurationDataService';

@Component({
  selector: 'app-milestone-template-dialog',
  templateUrl: './milestone-template-dialog.component.html',
})
export class MilestoneTemplateDialogComponent implements OnDestroy {
  @ViewChild(MilestoneTemplateFormComponent) public childComponent: MilestoneTemplateFormComponent;
  @Output() public milestoneTemplatedCreated = new EventEmitter<MilestoneTemplate>();

  public operationTypeId: number;
  public formGroup: FormGroup;

  public defaultMilestoneTemplate: MilestoneTemplate = {
    id: -1,
    name: '',
    dateOffset: 0,
  };

  private createMilestoneTemplateSubscription: Subscription;

  public constructor(
    public dialogRef: MatDialogRef<MilestoneTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { planTemplate: PlanTemplate },
    private configurationService: ConfigurationService,
    private configurationDataService: ConfigurationDataService
  ) {}

  public ngOnDestroy(): void {
    this.createMilestoneTemplateSubscription?.unsubscribe();
  }

  public onSubmit(milestoneTemplate: MilestoneTemplate): void {
    this.createMilestoneTemplateSubscription = this.configurationService
      .createMilestoneTemplate(this.data.planTemplate.id, milestoneTemplate)
      .subscribe({
        next: (newMilestoneTemplate: MilestoneTemplate) => {
          this.configurationDataService.setMilestoneTemplates(this.data.planTemplate.id);
          this.milestoneTemplatedCreated.emit(newMilestoneTemplate);
        },
        error: null,
        complete: () => {
          this.dialogRef.close();
        },
      });
  }

  public onCloseClick(): void {
    this.dialogRef.close();
  }

  public submitForm(): void {
    this.childComponent.submitForm();
  }
}
