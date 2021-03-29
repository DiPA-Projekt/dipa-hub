import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { SingleAppointmentResult } from 'dipa-api-client';

@Component({
  selector: 'app-single-appointment-form',
  templateUrl: './single-appointment-form.component.html',
  styleUrls: ['../project-task-form/project-task-form.component.scss'],
})
export class SingleAppointmentFormComponent implements OnInit {
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

  public get singleAppointmentsArray(): FormArray {
    return this.formGroup.get(['results', 'data']) as FormArray;
  }

  public addSingleAppointment(): void {
    this.singleAppointmentsArray.push(this.emptySingleAppointment);
  }

  public deleteSingleAppointment(index: number): void {
    this.singleAppointmentsArray.removeAt(index);
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

  private setReactiveForm(data: SingleAppointmentResult[]): void {
    for (const singleAppointment of data) {
      this.singleAppointmentsArray.push(
        this.fb.group({
          resultType: singleAppointment?.resultType,
          date: singleAppointment?.date,
          goal: singleAppointment?.goal,
          responsiblePerson: singleAppointment?.responsiblePerson,
          status: singleAppointment?.status,
        })
      );
    }
    this.formGroup.get(['results', 'type']).setValue('TYPE_SINGLE_APPOINTMENT');
  }

  private get emptySingleAppointment(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_SINGLE_APPOINTMENT',
      date: '',
      goal: '',
      responsiblePerson: '',
      status: null,
    });
  }
}
