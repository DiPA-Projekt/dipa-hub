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

  public getFormFieldsArray(index: number): FormArray {
    return this.formGroup.get(['results', 'data', index, 'formFields']) as FormArray;
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
          formFields: appointmentSeries?.formFields,
        })
      );
    }
    this.formGroup.get(['results', 'type']).setValue('TYPE_APPT_SERIES');
  }

  private get emptyAppointmentSeries(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_APPT_SERIES',
      formFields: [
        {
          value: '',
          key: 'appointment',
          label: '',
          placeholder: '',
          required: false,
          sortOrder: '1',
          controlType: 'TEXTBOX',
          type: 'TEXT',
          show: true,
        },
        {
          value: '',
          key: 'participants',
          label: '',
          placeholder: '',
          required: false,
          sortOrder: '2',
          controlType: 'TEXTBOX',
          type: 'TEXT',
          show: true,
        },
        {
          value: '',
          key: 'link',
          label: '',
          placeholder: '',
          required: false,
          sortOrder: '3',
          controlType: 'TEXTBOX',
          type: 'URL',
          show: true,
        },
        {
          value: '',
          key: 'note',
          label: 'Notizen',
          placeholder: '',
          required: false,
          sortOrder: '4',
          controlType: 'TEXTAREA',
          show: true,
        },
        {
          value: '',
          key: 'status',
          label: '',
          placeholder: '',
          required: false,
          sortOrder: '5',
          controlType: 'DROPDOWN',
          type: '',
          show: true,
          options: [
            { key: 'OPEN', value: 'offen' },
            { key: 'CLOSED', value: 'geschlossen' },
            { key: 'PLANNED', value: 'geplant' },
            { key: 'ASSIGNED', value: 'zugewiesen' },
            { key: 'IN_PROGRESS', value: 'in Bearbeitung' },
            { key: 'SUBMITTED', value: 'vorgelegt' },
            { key: 'DONE', value: 'fertiggestellt' },
          ],
        },
      ],
    });
  }
}
