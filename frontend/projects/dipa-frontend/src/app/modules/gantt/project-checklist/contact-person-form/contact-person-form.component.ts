import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ContactPersonResult } from 'dipa-api-client';

@Component({
  selector: 'app-contact-person-form',
  templateUrl: './contact-person-form.component.html',
  styleUrls: ['../project-task-form/project-task-form.component.scss'],
})
export class ContactPersonFormComponent implements OnInit {
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

  public get personsArray(): FormArray {
    return this.formGroup.get(['results', 'data']) as FormArray;
  }

  public addPerson(): void {
    this.personsArray.push(this.emptyPerson);
  }

  public deletePerson(index: number): void {
    this.personsArray.removeAt(index);
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

  private setReactiveForm(data: ContactPersonResult[]): void {
    for (const person of data) {
      this.personsArray.push(
        this.fb.group({
          resultType: person?.resultType,
          formFields: person?.formFields,
        })
      );
    }
    this.formGroup.get(['results', 'type']).setValue('TYPE_CONTACT_PERS');
  }

  private get emptyPerson(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_CONTACT_PERS',
      name: '',
      department: '',
      taskArea: '',
      status: null,
    });
  }
}
