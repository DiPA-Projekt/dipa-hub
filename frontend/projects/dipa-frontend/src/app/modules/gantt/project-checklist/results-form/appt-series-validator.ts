import { Injectable } from '@angular/core';
import { FormArray, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class AppointmentSeriesValidator {
  private static allFieldsSet(formFieldsArray: FormArray): boolean {
    const serie = formFieldsArray.controls.find((y) => y.get('key').value === 'serie')?.get('value');
    const startTime = formFieldsArray.controls.find((y) => y.get('key').value === 'startTime')?.get('value');
    const duration = formFieldsArray.controls.find((y) => y.get('key').value === 'duration')?.get('value');
    const startDate = formFieldsArray.controls.find((y) => y.get('key').value === 'startDate')?.get('value');
    const endDate = formFieldsArray.controls.find((y) => y.get('key').value === 'endDate')?.get('value');
    const appointment = formFieldsArray.controls.find((y) => y.get('key').value === 'appointment')?.get('value');
    const participants = formFieldsArray.controls.find((y) => y.get('key').value === 'participants')?.get('value');

    return (
      serie?.value !== '' &&
      startTime?.value !== '' &&
      duration?.value !== '' &&
      startDate?.value !== '' &&
      endDate?.value !== '' &&
      appointment?.value !== '' &&
      participants?.value !== ''
    );
  }

  public validRruleAndStatusSet(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const formFieldsArray = formGroup.get('formFields') as FormArray;
      const allFieldsSet = AppointmentSeriesValidator.allFieldsSet(formFieldsArray);

      const status = formFieldsArray.controls.find((y) => y.get('key').value === 'status')?.get('value');

      return status?.value === '' && !allFieldsSet ? { invalidAppointmentSeries: true } : null;
    };
  }

  public statusMissingForEventCalculation(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const formFieldsArray = formGroup.get('formFields') as FormArray;
      const allFieldsSet = AppointmentSeriesValidator.allFieldsSet(formFieldsArray);

      const status = formFieldsArray.controls.find((y) => y.get('key').value === 'status')?.get('value');

      if (allFieldsSet && status?.disabled) {
        status.enable();
      } else if (!allFieldsSet && !status?.disabled) {
        status.disable();
      }

      return status.value === '' && allFieldsSet ? { readyForEventCalculation: true } : null;
    };
  }

  public startBeforeEnd(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const formFieldsArray = formGroup.get('formFields') as FormArray;

      const startDate = formFieldsArray.controls.find((y) => y.get('key').value === 'startDate')?.get('value');
      const endDate = formFieldsArray.controls.find((y) => y.get('key').value === 'endDate')?.get('value');

      return new Date(startDate?.value) > new Date(endDate?.value) ? { startBeforeEnd: true } : null;
    };
  }
}
