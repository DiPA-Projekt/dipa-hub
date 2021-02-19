import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { SingleAppointmentResult } from 'dipa-api-client';
import Utils from '../../../../shared/utils';

@Component({
  selector: 'app-single-appointment-form',
  templateUrl: './single-appointment-form.component.html',
  styleUrls: ['../project-task-form/project-task-form.component.scss'],
})
export class SingleAppointmentFormComponent implements OnInit {
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

  setReactiveForm(data: SingleAppointmentResult[]): void {
    for (const singleAppointment of data) {
      this.singleAppointmentsArray.push(
        this.fb.group({
          resultType: singleAppointment?.resultType,
          date: Utils.parseGermanDate(singleAppointment?.date),
          goal: singleAppointment?.goal,
          responsiblePerson: singleAppointment?.responsiblePerson,
          status: singleAppointment?.status,
        })
      );
    }
    this.formGroup.get('results').get('type').setValue('TYPE_SINGLE_APPOINTMENT');
  }

  get emptySingleAppointment(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_SINGLE_APPOINTMENT',
      date: '',
      goal: '',
      responsiblePerson: '',
      status: null,
    });
  }

  get singleAppointmentsArray(): FormArray {
    return this.formGroup.get('results').get('data') as FormArray;
  }

  addSingleAppointment(): void {
    this.singleAppointmentsArray.push(this.emptySingleAppointment);
  }

  deleteSingleAppointment(index: number): void {
    this.singleAppointmentsArray.removeAt(index);
    this.dataChanged.emit();
  }
}
