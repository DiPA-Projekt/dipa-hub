import { OnInit, Output, EventEmitter, Component } from '@angular/core';
import { FormArray, FormGroup, FormGroupDirective } from '@angular/forms';
import { Result } from 'dipa-api-client';
import ResultTypeEnum = Result.ResultTypeEnum;

interface SelectOption {
  value: string;
  viewValue: string;
}

interface SelectOptionGroup {
  name: string;
  fields: SelectOption[];
}

@Component({
  selector: 'app-show-fields-menu',
  templateUrl: './show-fields-menu.component.html',
  styleUrls: ['./show-fields-menu.component.scss'],
})
export class ShowFieldsMenuComponent implements OnInit {
  @Output() public selectionChange = new EventEmitter();

  public entries: SelectOption[] = [];
  public formFieldGroups: SelectOptionGroup[] = [];

  public selectedEntries: string[] = [];
  public selectedFields: string[] = [];

  public formGroup: FormGroup;

  public constructor(public formGroupDirective: FormGroupDirective) {}

  public static getResultTypeName(resultType: ResultTypeEnum): string {
    let resultTypeName: string;

    switch (resultType) {
      case 'TYPE_STD':
        resultTypeName = 'Standard';
        break;
      case 'TYPE_CONTACT_PERS':
        resultTypeName = 'Kontaktperson';
        break;
      case 'TYPE_SUBTASK':
        resultTypeName = 'Aufgabe';
        break;
      case 'TYPE_ELBE_SC':
        resultTypeName = 'Einkaufswagen';
        break;
      case 'TYPE_RISK':
        resultTypeName = 'Risiko';
        break;
      case 'TYPE_SINGLE_APPOINTMENT':
        resultTypeName = 'Termin';
        break;
      case 'TYPE_APPT_SERIES':
        resultTypeName = 'Terminserie';
        break;
      case 'TYPE_TEAM_PERS':
        resultTypeName = 'Team';
        break;
      case 'TYPE_LINK':
        resultTypeName = 'Link';
        break;
      default:
        resultTypeName = '';
    }
    return resultTypeName;
  }

  public ngOnInit(): void {
    this.formGroup = this.formGroupDirective.control;
    this.setEntries();
    this.setFormFieldGroups();

    this.initSelectedEntries();
    this.initSelectedFields();
  }

  public getFormFieldsArray(resultGroup: FormGroup): FormArray {
    return resultGroup.get(['formFields']) as FormArray;
  }

  public get resultsArray(): FormArray {
    return this.formGroup.get(['results']) as FormArray;
  }

  public get entriesArray(): FormArray {
    return this.formGroup.get('entries') as FormArray;
  }

  public changeShowSelectionEntries(event: string[]): void {
    // entries
    this.selectedEntries = event;

    for (const entry of this.entriesArray.controls) {
      const showItem = this.selectedEntries.includes(entry.get('key').value);
      entry.get('show').setValue(showItem);
    }
    this.selectionChange.emit(event);
  }

  public changeShowSelectionFields(event: string[]): void {
    // results
    this.selectedFields = event;
    for (const result of this.resultsArray.controls) {
      const formFieldsArray = result.get('formFields') as FormArray;

      for (const ffEntry of formFieldsArray.controls) {
        const currentKey = ffEntry.get('key').value as string;
        const showItem = this.selectedFields.includes(`formFields.${currentKey}`);
        ffEntry.get('show').setValue(showItem);
      }
    }
    this.selectionChange.emit(event);
  }

  private setEntries(): void {
    const entryValues: { value: string; viewValue: string }[] = [];
    for (const formFieldEntry of this.entriesArray.controls) {
      if (formFieldEntry.get('show').value !== null) {
        entryValues.push({
          value: `${formFieldEntry.get('key').value as string}`,
          viewValue: formFieldEntry.get('label').value as string,
        });
      }
    }

    this.entries = entryValues;
  }

  private initSelectedEntries(): string[] {
    this.selectedEntries = [];

    for (const entry of this.entriesArray.controls) {
      if (entry.get('show').value) {
        this.selectedEntries.push(entry.get('key').value);
      }
    }

    return this.selectedEntries;
  }

  private initSelectedFields() {
    this.selectedFields = [];

    const resultFormGroup = this.resultsArray.controls[0] as FormGroup;

    if (resultFormGroup !== undefined) {
      const formFieldsArray = this.getFormFieldsArray(resultFormGroup);
      if (formFieldsArray?.length > 0) {
        for (const formFieldEntry of formFieldsArray.controls) {
          if (formFieldEntry.get('show')?.value === true) {
            this.selectedFields.push(`formFields.${formFieldEntry.get('key').value as string}`);
          }
        }
      }
    }

    return this.selectedFields;
  }

  private setFormFieldGroups(): void {
    const groupValues: { value: string; viewValue: string }[] = [];
    const resultFormGroup = this.resultsArray.controls[0] as FormGroup;

    if (resultFormGroup !== undefined) {
      const formFieldsArray = this.getFormFieldsArray(resultFormGroup);
      if (formFieldsArray?.length > 0) {
        for (const formFieldEntry of formFieldsArray.controls) {
          if (formFieldEntry.get('show').value !== null) {
            groupValues.push({
              value: `formFields.${formFieldEntry.get('key').value as string}`,
              viewValue: formFieldEntry.get('label').value as string,
            });
          }
        }
      }

      const resultTypeName = ShowFieldsMenuComponent.getResultTypeName(resultFormGroup.get('resultType').value);

      if (!this.formFieldGroups.find((formField) => formField.name === resultTypeName)) {
        this.formFieldGroups.push({
          name: resultTypeName,
          fields: groupValues,
        });
      }
    }
  }
}
