import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { RiskResult } from 'dipa-api-client';

@Component({
  selector: 'app-risk-form',
  templateUrl: './risk-form.component.html',
  styleUrls: ['../project-task-form/project-task-form.component.scss'],
})
export class RiskFormComponent implements OnInit {
  @Input() public formData;
  @Input() public statusList;
  @Output() public dataChanged = new EventEmitter();

  public formGroup: FormGroup;

  public constructor(public controlContainer: ControlContainer, parent: FormGroupDirective, private fb: FormBuilder) {
    this.formGroup = parent.control;
  }

  public ngOnInit(): void {
    this.setReactiveForm(this.formData);
  }

  public getFormFieldsArray(index: number): FormArray {
    return this.formGroup.get(['results', 'data', index, 'formFields']) as FormArray;
  }

  public get risksArray(): FormArray {
    return this.formGroup.get(['results', 'data']) as FormArray;
  }

  public addRisk(): void {
    this.risksArray.push(this.emptyRisk);
  }

  public deleteRisk(index: number): void {
    this.risksArray.removeAt(index);
    this.dataChanged.emit();
  }

  public onFocus(event: FocusEvent, path: (string | number)[]): void {
    const valueInput = event.target as HTMLInputElement;
    valueInput.setAttribute('data-value', this.formGroup.get(path).value || '');
  }

  public onEscape(event: KeyboardEvent, path: (string | number)[]): void {
    const valueInput = event.target as HTMLInputElement;
    valueInput.value = valueInput.getAttribute('data-value');
    this.formGroup.get(path).setValue(valueInput.value);
  }

  private setReactiveForm(data: RiskResult[]): void {
    for (const risk of data) {
      this.risksArray.push(
        this.fb.group({
          resultType: risk?.resultType,
          formFields: risk?.formFields,
        })
      );
    }
    this.formGroup.get(['results', 'type']).setValue('TYPE_RISK');
  }

  private get emptyRisk(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_RISK',
      description: '',
      value: '',
      solution: '',
      status: null,
    });
  }
}
