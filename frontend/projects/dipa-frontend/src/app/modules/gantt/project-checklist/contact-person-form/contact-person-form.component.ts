import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ContactPersonResult } from 'dipa-api-client';

@Component({
  selector: 'app-contact-person-form',
  templateUrl: './contact-person-form.component.html',
  styleUrls: ['./contact-person-form.component.scss'],
})
export class ContactPersonFormComponent implements OnInit {
  @Input() formData;
  @Input() statusList;
  @Output() dataChanged = new EventEmitter();

  formGroup: FormGroup;

  constructor(public controlContainer: ControlContainer, parent: FormGroupDirective, private fb: FormBuilder) {
    this.formGroup = parent.control;
  }

  ngOnInit(): any {
    this.setReactiveForm(this.formData);
  }

  setReactiveForm(data: ContactPersonResult[]): void {
    for (const person of data) {
      this.personsArray.push(
        this.fb.group({
          resultType: person?.resultType,
          name: person?.name,
          department: person?.department,
          taskArea: person?.taskArea,
          status: person?.status,
        })
      );
    }
    this.formGroup.get('results').get('type').setValue('TYPE_CONTACT_PERS');
  }

  get emptyPerson(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_CONTACT_PERS',
      name: '',
      department: '',
      taskArea: '',
      status: null,
    });
  }

  get personsArray(): FormArray {
    return this.formGroup.get('results').get('data') as FormArray;
  }

  addPerson(): void {
    this.personsArray.push(this.emptyPerson);
  }

  deletePerson(index: number): void {
    this.personsArray.removeAt(index);
    this.dataChanged.emit();
  }
}
