import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  OperationType,
  OperationTypesService,
  ProjectApproach,
  ProjectApproachesService,
  ProjectService,
  PropertyQuestion,
  RecurringEventType,
  ConfigurationService,
} from 'dipa-api-client';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../../authentication.service';
import { RecurringEventFormComponent } from '../recurring-event-form/recurring-event-form.component';
import { ConfigurationDataService } from '../../../shared/configurationDataService';

@Component({
  selector: 'app-recurring-event-dialog',
  templateUrl: './recurring-event-dialog.component.html',
})
export class RecurringEventDialogComponent implements OnInit, OnDestroy {
  @ViewChild(RecurringEventFormComponent) childComponent: RecurringEventFormComponent;

  public operationTypesList: Array<OperationType> = [];
  public projectApproachesList: Array<ProjectApproach> = [];

  public operationTypeId: number;
  public startDate = new Date();
  public endDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
  public formGroup: FormGroup;

  public propertyQuestions: PropertyQuestion[] = [];

  public defaultRecurringEventType: RecurringEventType = {
    id: -1,
    title: '',
    mandatory: false,
    recurringEventPattern: {
      id: -1,
      rulePattern: 'FREQ=MONTHLY;BYMONTHDAY=5;INTERVAL=2',
    },
    projectPropertyQuestionId: -1,
  };

  private dataSubscription: Subscription;
  private createRecurringEventTypeSubscription: Subscription;

  public constructor(
    public dialogRef: MatDialogRef<RecurringEventDialogComponent>,
    private authenticationService: AuthenticationService,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService,
    private projectService: ProjectService,
    private configurationService: ConfigurationService,
    private configurationDataService: ConfigurationDataService
  ) {}

  public ngOnInit(): void {
    this.dataSubscription = this.projectService
      .getAllProjectPropertyQuestions()
      .subscribe((data: PropertyQuestion[]) => {
        this.propertyQuestions = data;
      });
  }

  public ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
    this.createRecurringEventTypeSubscription?.unsubscribe();
  }

  public onSubmit(recurringEventType: RecurringEventType): void {
    this.createRecurringEventTypeSubscription = this.configurationService
      .createRecurringEventType(recurringEventType)
      .subscribe({
        next: (data: any) => {
          this.configurationDataService.setRecurringEvents();
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
