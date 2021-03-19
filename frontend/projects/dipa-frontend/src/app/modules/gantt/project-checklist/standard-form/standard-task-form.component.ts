import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { StandardResult } from 'dipa-api-client';

@Component({
  selector: 'app-default-task-form',
  templateUrl: './standard-task-form.component.html',
})
export class StandardTaskFormComponent implements OnInit {
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

  public get defaultTaskArray(): FormArray {
    return this.formGroup.get(['results', 'data']) as FormArray;
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

  private setReactiveForm(data: StandardResult[]): void {
    for (const defaultTask of data) {
      const formFieldsArray = this.fb.array([]);

      for (const formField of defaultTask?.formFields) {
        formFieldsArray.push(this.fb.group(formField));
      }

      this.defaultTaskArray.push(
        this.fb.group({
          resultType: defaultTask?.resultType,
          formFields: formFieldsArray,
        })
      );
    }
    this.formGroup.get(['results', 'type']).setValue('TYPE_STD');
  }
}
