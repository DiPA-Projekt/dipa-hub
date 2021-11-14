import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { OperationTypesService, PlanTemplate, ProjectApproachesService, ConfigurationService } from 'dipa-api-client';
import { FormGroup } from '@angular/forms';
import { PlanTemplateFormComponent } from '../plan-template-form/plan-template-form.component';
import { ConfigurationDataService } from '../../../shared/configurationDataService';

@Component({
  selector: 'app-plan-template-dialog',
  templateUrl: './plan-template-dialog.component.html',
})
export class PlanTemplateDialogComponent implements OnInit, OnDestroy {
  @ViewChild(PlanTemplateFormComponent) public childComponent: PlanTemplateFormComponent;
  @Output() public planTemplatedCreated = new EventEmitter<PlanTemplate>();

  public operationTypeId: number;
  public formGroup: FormGroup;

  public defaultPlanTemplate: PlanTemplate = {
    id: -1,
    name: '',
    projectApproaches: [
      {
        id: 8,
        name: 'BA Lifecycle',
        operationTypeId: 3,
      },
    ],
    milestoneTemplates: [],
  };

  private createPlanTemplateSubscription: Subscription;

  public constructor(
    public dialogRef: MatDialogRef<PlanTemplateDialogComponent>,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService,
    private configurationService: ConfigurationService,
    private configurationDataService: ConfigurationDataService
  ) {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
    this.createPlanTemplateSubscription?.unsubscribe();
  }

  public onSubmit(planTemplate: PlanTemplate): void {
    this.createPlanTemplateSubscription = this.configurationService.createPlanTemplate(planTemplate).subscribe({
      next: (newPlanTemplate: PlanTemplate) => {
        this.configurationDataService.setPlanTemplates();
        this.planTemplatedCreated.emit(newPlanTemplate);
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
