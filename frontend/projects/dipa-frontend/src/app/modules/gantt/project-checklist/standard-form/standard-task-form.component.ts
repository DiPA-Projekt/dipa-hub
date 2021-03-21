import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { OptionEntry, StandardResult } from 'dipa-api-client';

interface SelectOption {
  value: string;
  viewValue: string;
}

interface SelectOptionGroup {
  name: string;
  fields: SelectOption[];
}

@Component({
  selector: 'app-standard-task-form',
  templateUrl: './standard-task-form.component.html',
})
export class StandardTaskFormComponent implements OnInit {
  @Input() public formData;
  @Input() public statusList;
  @Input() public showFieldsForm: FormControl;
  @Input() public formFieldGroups: SelectOptionGroup[];
  @Output() public dataChanged = new EventEmitter();

  public formGroup: FormGroup;

  public constructor(public controlContainer: ControlContainer, parent: FormGroupDirective, private fb: FormBuilder) {
    this.formGroup = parent.control;
  }

  public ngOnInit(): void {
    this.setReactiveForm(this.formData);

    // TODO: eigene Funktion
    const currentShowFields = this.showFieldsForm.value as string[];
    this.showFieldsForm.setValue([...currentShowFields, ...this.getShowFieldsSelection()]);
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

  private getShowFieldsSelection(): string[] {
    const groupValues: { value: string; viewValue: string }[] = [];
    const selectedValues: string[] = [];

    const formFieldsArray = this.getFormFieldsArray(0);
    if (formFieldsArray?.length > 0) {
      for (const formFieldEntry of formFieldsArray.controls) {
        // TODO
        if (formFieldEntry.get('show').value !== null) {
          if (formFieldEntry.get('show').value === true) {
            selectedValues.push(`formFields.${formFieldEntry.get('key').value as string}`);
          }
          groupValues.push({
            value: `formFields.${formFieldEntry.get('key').value as string}`,
            viewValue: formFieldEntry.get('label').value as string,
          });
        }
      }
    }
    this.formFieldGroups.push({ name: 'Standard', fields: groupValues });
    return selectedValues;
  }

  private setReactiveForm(data: StandardResult[]): void {
    for (const defaultTask of data) {
      const formFieldsArray = this.fb.array([]);

      // TODO
      for (const formField of defaultTask?.formFields) {
        const options = this.getOptionsArray(formField?.options);

        const formFieldEntry = this.fb.group({
          id: formField?.id,
          value: formField?.value,
          key: formField?.key,
          label: formField?.label,
          placeholder: formField?.placeholder,
          required: formField?.required,
          sortOrder: formField?.sortOrder,
          controlType: formField?.controlType,
          type: formField?.type,
          options,
          show: formField?.show,
        });

        formFieldsArray.push(formFieldEntry);
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

  private getOptionsArray(options: OptionEntry[]): FormArray {
    const optionsArray = this.fb.array([]);

    for (const option of options) {
      optionsArray.push(
        this.fb.group({
          key: option?.key,
          value: option?.value,
        })
      );
    }
    return optionsArray;
  }
}
