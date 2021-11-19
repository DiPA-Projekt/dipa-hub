import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MilestoneTemplate } from 'dipa-api-client';

@Component({
  selector: 'app-milestone-template-form',
  templateUrl: './milestone-template-form.component.html',
})
export class MilestoneTemplateFormComponent implements OnInit, OnDestroy {
  @Input() public result: MilestoneTemplate;
  @Input() public formGroup: FormGroup;
  @Input() public submitCallback: (param: any) => void;

  @Output() public formSubmitted = new EventEmitter<MilestoneTemplate>();
  @Output() public formValueChanged = new EventEmitter<FormGroup>();

  private dataSubscription: Subscription;

  public constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.setReactiveForm();
  }

  public ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
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
      name: this.result?.name,
      dateOffset: this.result?.dateOffset,
    });
  }
}
