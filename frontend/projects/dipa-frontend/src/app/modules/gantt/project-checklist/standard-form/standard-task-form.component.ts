import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { StandardResult } from 'dipa-api-client';

@Component({
  selector: 'app-default-task-form',
  templateUrl: './standard-task-form.component.html',
  styleUrls: ['./standard-task-form.component.scss'],
})
export class StandardTaskFormComponent implements OnInit {
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

  setReactiveForm(data: StandardResult[]): void {
    for (const defaultTask of data) {
      this.defaultTaskArray.push(
        this.fb.group({
          resultType: defaultTask?.resultType,
          result: defaultTask?.result,
          status: defaultTask?.status,
        })
      );
    }
    this.formGroup.get('results').get('type').setValue('TYPE_STD');
  }

  get defaultTaskArray(): FormArray {
    return this.formGroup.get('results').get('data') as FormArray;
  }
}
