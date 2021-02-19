import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { AppointmentSeriesResult } from 'dipa-api-client';

@Component({
  selector: 'app-appointment-series-form',
  templateUrl: './appointment-series-form.component.html',
  styleUrls: ['./appointment-series-form.component.scss'],
})
export class AppointmentSeriesFormComponent implements OnInit {
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

  setReactiveForm(data: AppointmentSeriesResult[]): void {
    for (const appointmentSeries of data) {
      this.appointmentSeriesArray.push(
        this.fb.group({
          resultType: appointmentSeries?.resultType,
          appointment: appointmentSeries?.appointment,
          participants: appointmentSeries?.participants,
          link: appointmentSeries?.link,
          status: appointmentSeries?.status,
        })
      );
    }
    this.formGroup.get('results').get('type').setValue('TYPE_APPT_SERIES');
  }

  get emptyAppointmentSeries(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_APPT_SERIES',
      appointment: '',
      participants: '',
      link: '',
      status: null,
    });
  }

  get appointmentSeriesArray(): FormArray {
    return this.formGroup.get('results').get('data') as FormArray;
  }

  addAppointmentSeries(): void {
    this.appointmentSeriesArray.push(this.emptyAppointmentSeries);
  }

  deleteAppointmentSeries(index: number): void {
    this.appointmentSeriesArray.removeAt(index);
    this.dataChanged.emit();
  }
}
