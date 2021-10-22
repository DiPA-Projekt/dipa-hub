import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ProjectService, PropertyQuestion, RecurringEventPattern, RecurringEventType } from 'dipa-api-client';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recurring-event-form',
  templateUrl: './recurring-event-form.component.html',
  styleUrls: ['./recurring-event-form.component.scss'],
})
export class RecurringEventFormComponent implements OnInit, OnDestroy {
  @Input() public result: RecurringEventType;
  @Input() public formGroup: FormGroup;
  @Input() public submitCallback: (param: any) => void;

  @Output() public formSubmitted = new EventEmitter<RecurringEventType>();
  @Output() public formValueChanged = new EventEmitter<FormGroup>();

  public propertyQuestions: PropertyQuestion[] = [];

  private dataSubscription: Subscription;

  public constructor(private fb: FormBuilder, private projectService: ProjectService) {}

  public ngOnInit(): void {
    this.dataSubscription = this.projectService
      .getAllProjectPropertyQuestions()
      .subscribe((data: PropertyQuestion[]) => {
        this.propertyQuestions = data;
        this.setReactiveForm();
      });

    this.setReactiveForm();
  }

  public ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  public rruleChanged($event: string): void {
    this.formGroup.get(['recurringEventPattern', 'rulePattern']).setValue($event);
    this.formValueChanged.emit(this.formGroup);
  }

  public submitForm(): void {
    this.onSubmit(this.formGroup);
  }

  public onSubmit(form: FormGroup): void {
    if (form.valid) {
      this.formSubmitted.emit(form.value);
    }
  }

  private setReactiveForm(): void {
    this.formGroup = this.fb.group({
      id: this.result?.id || -1,
      title: this.result?.title,
      description: this.result?.description,
      recurringEventPattern: this.getPatternForm(this.result?.recurringEventPattern),
      mandatory: this.result?.mandatory,
      projectPropertyQuestionId: this.result?.projectPropertyQuestionId,
    });
  }

  private getPatternForm(pattern: RecurringEventPattern): FormGroup {
    return this.fb.group({
      id: pattern?.id || -1,
      rulePattern: pattern?.rulePattern,
      startDate: pattern?.startDate,
      endDate: pattern?.endDate,
      duration: pattern?.duration,
      recurringEventTypeId: pattern?.recurringEventTypeId,
    });
  }
}
