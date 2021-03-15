import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { AppointmentSeriesResult } from 'dipa-api-client';

@Component({
  selector: 'app-appointment-series-form',
  templateUrl: './appointment-series-form.component.html',
  styleUrls: ['../project-task-form/project-task-form.component.scss'],
})
export class AppointmentSeriesFormComponent implements OnInit {
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

  public get appointmentSeriesArray(): FormArray {
    return this.formGroup.get(['results', 'data']) as FormArray;
  }

  public addAppointmentSeries(): void {
    this.appointmentSeriesArray.push(this.emptyAppointmentSeries);
  }

  public deleteAppointmentSeries(index: number): void {
    this.appointmentSeriesArray.removeAt(index);
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

  private setReactiveForm(data: AppointmentSeriesResult[]): void {
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
    this.formGroup.get(['results', 'type']).setValue('TYPE_APPT_SERIES');
  }

  private get emptyAppointmentSeries(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_APPT_SERIES',
      appointment: '',
      participants: '',
      link: '',
      status: null,
    });
  }
}
