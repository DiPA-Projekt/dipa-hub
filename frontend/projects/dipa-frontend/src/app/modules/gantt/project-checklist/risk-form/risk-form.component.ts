import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { RiskResult } from 'dipa-api-client';

@Component({
  selector: 'app-risk-form',
  templateUrl: './risk-form.component.html',
  styleUrls: ['../project-task-form/project-task-form.component.scss'],
})
export class RiskFormComponent implements OnInit {
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

  setReactiveForm(data: RiskResult[]): void {
    for (const risk of data) {
      this.risksArray.push(
        this.fb.group({
          resultType: risk?.resultType,
          description: risk.description,
          value: risk?.value,
          solution: risk?.solution,
          status: risk?.status,
        })
      );
    }
    this.formGroup.get('results').get('type').setValue('TYPE_RISK');
  }

  get emptyRisk(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_RISK',
      description: '',
      value: '',
      solution: '',
      status: null,
    });
  }

  get risksArray(): FormArray {
    return this.formGroup.get('results').get('data') as FormArray;
  }

  addRisk(): void {
    this.risksArray.push(this.emptyRisk);
  }

  deleteRisk(index: number): void {
    this.risksArray.removeAt(index);
    this.dataChanged.emit();
  }
}
