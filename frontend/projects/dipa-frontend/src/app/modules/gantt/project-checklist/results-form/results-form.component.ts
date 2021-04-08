import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { OptionEntry, Result } from 'dipa-api-client';
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
  selector: 'app-results-form',
  templateUrl: './results-form.component.html',
  styleUrls: ['../project-task-form/project-task-form.component.scss'],
})
export class ResultsFormComponent implements OnInit {
  @Input() public formData: FormArray;
  @Input() public statusList: OptionEntry[];
  @Input() public showFieldsForm: FormControl;
  @Input() public formFieldGroups: SelectOptionGroup[];
  @Output() public dataChanged = new EventEmitter();

  public formGroup: FormGroup;

  public constructor(public formGroupDirective: FormGroupDirective, private fb: FormBuilder) {}

  public static getResultTypeName(resultType: ResultTypeEnum): string {
    let resultTypeName = '';

    switch (resultType) {
      case 'TYPE_STD':
        resultTypeName = 'Standard';
        break;
      case 'TYPE_ELBE_SC':
        resultTypeName = 'Einkaufswagen';
        break;
      case 'TYPE_CONTACT_PERS':
        resultTypeName = 'Kontaktperson';
        break;
      case 'TYPE_APPT_SERIES':
        resultTypeName = 'Terminserie';
        break;
      case 'TYPE_RISK':
        resultTypeName = 'Risiko';
        break;
      case 'TYPE_SINGLE_APPOINTMENT':
        resultTypeName = 'Termin';
        break;
      default:
        resultTypeName = '';
    }
    return resultTypeName;
  }

  public ngOnInit(): void {
    this.formGroup = this.formGroupDirective.control;
    // this.setReactiveForm(this.formData);
    // TODO: eigene Funktion
    const currentShowFields = this.showFieldsForm.value as string[];
    this.showFieldsForm.setValue([...currentShowFields, ...this.getShowFieldsSelection()]);
  }

  public getFormFieldsArray(resultGroup: FormGroup): FormArray {
    // return this.formData.get([index, 'formFields']) as FormArray;
    return resultGroup.get(['formFields']) as FormArray;
  }

  public get resultsArray(): FormArray {
    return this.formGroup.get(['results']) as FormArray;
  }

  public addResult(resultType: ResultTypeEnum): void {
    this.resultsArray.push(this.getEmptyResult(resultType));
  }

  public getResultType(): ResultTypeEnum {
    return this.formData.get([0, 'resultType']).value as ResultTypeEnum;
  }

  public deleteResult(index: number): void {
    this.resultsArray.removeAt(index);
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

  private getShowFieldsSelection(): string[] {
    const groupValues: { value: string; viewValue: string }[] = [];
    const selectedValues: string[] = [];

    const resultFormGroup = this.resultsArray.controls[0] as FormGroup;

    if (resultFormGroup !== undefined) {
      const formFieldsArray = this.getFormFieldsArray(resultFormGroup);
      if (formFieldsArray?.length > 0) {
        for (const formFieldEntry of formFieldsArray.controls) {
          // TODO
          if (formFieldEntry.get('show').value !== null) {
            if (formFieldEntry.get('show').value === true) {
              selectedValues.push(`formFields.${formFieldEntry.get('key').value as string}`);
            }
            groupValues.push({
              value: `formFields.${formFieldEntry.get('key').value as string}`,
              viewValue: formFieldEntry.get('label').value as string,
            });
          }
        }
      }

      const resultTypeName = ResultsFormComponent.getResultTypeName(resultFormGroup.get('resultType').value);

      if (!this.formFieldGroups.find((formField) => formField.name === resultTypeName)) {
        this.formFieldGroups.push({
          name: resultTypeName,
          fields: groupValues,
        });
      }
    }
    return selectedValues;
  }

  private getEmptyResult(resultType: ResultTypeEnum): FormGroup {
    switch (resultType) {
      case 'TYPE_STD':
        return this.fb.group({
          resultType: 'TYPE_STD',
          formFields: this.getStandardFormFields(),
        });
      case 'TYPE_CONTACT_PERS':
        return this.fb.group({
          resultType: 'TYPE_CONTACT_PERS',
          formFields: this.getContactPersonFormFields(),
        });
      case 'TYPE_ELBE_SC':
        return this.fb.group({
          resultType: 'TYPE_ELBE_SC',
          formFields: this.getCartFormFields(),
        });
      case 'TYPE_RISK':
        return this.fb.group({
          resultType: 'TYPE_CONTACT_PERS',
          formFields: this.getRiskFormFields(),
        });
      case 'TYPE_SINGLE_APPOINTMENT':
        return this.fb.group({
          resultType: 'TYPE_SINGLE_APPOINTMENT',
          formFields: this.getSingleAppointmentFormFields(),
        });
      case 'TYPE_APPT_SERIES':
        return this.fb.group({
          resultType: 'TYPE_APPT_SERIES',
          formFields: this.getAppointmentSeriesFormFields(),
        });
      default:
        break;
    }
  }

  private getStandardFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getShowFieldsSelection();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'contactPerson',
        label: 'Ansprechpartner',
        placeholder: 'Ansprechpartner',
        required: false,
        sortOrder: 1,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.contactPerson'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'link',
        label: 'Link',
        placeholder: 'Link',
        required: false,
        sortOrder: 2,
        controlType: 'TEXTBOX',
        type: 'URL',
        show: selectedValues.includes('formFields.link'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
        placeholder: 'Notizen',
        required: false,
        sortOrder: 3,
        controlType: 'TEXTAREA',
        show: selectedValues.includes('formFields.note'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'status',
        label: 'Status',
        placeholder: 'Status',
        required: false,
        sortOrder: 4,
        controlType: 'DROPDOWN',
        type: '',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'OPEN', value: 'offen' },
          { key: 'CLOSED', value: 'geschlossen' },
          { key: 'PLANNED', value: 'geplant' },
          { key: 'ASSIGNED', value: 'zugewiesen' },
          { key: 'IN_PROGRESS', value: 'in Bearbeitung' },
          { key: 'SUBMITTED', value: 'vorgelegt' },
          { key: 'DONE', value: 'fertiggestellt' },
        ]),
      })
    );
    return resultsArray;
  }

  private getContactPersonFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getShowFieldsSelection();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'name',
        label: 'Name',
        placeholder: 'Name',
        required: false,
        sortOrder: 1,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.name'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'department',
        label: 'Referat',
        placeholder: 'Referat',
        required: false,
        sortOrder: 2,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.department'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'taskArea',
        label: 'Aufgabenbereich',
        placeholder: 'Aufgabenbereich',
        required: false,
        sortOrder: 3,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.taskArea'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'link',
        label: 'Link',
        placeholder: 'URL',
        required: false,
        sortOrder: 4,
        controlType: 'TEXTBOX',
        type: 'URL',
        show: selectedValues.includes('formFields.link'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
        placeholder: 'Notizen',
        required: false,
        sortOrder: 5,
        controlType: 'TEXTAREA',
        show: selectedValues.includes('formFields.note'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'status',
        label: 'Status',
        placeholder: 'Status',
        required: false,
        sortOrder: 6,
        controlType: 'DROPDOWN',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'OPEN', value: 'offen' },
          { key: 'CONTACTED', value: 'angesprochen' },
          { key: 'ANSWER_RECEIVED', value: 'Antwort erhalten' },
          { key: 'DONE', value: 'abgeschlossen' },
        ]),
      })
    );

    return resultsArray;
  }

  private getCartFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getShowFieldsSelection();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'shoppingCartNumber',
        label: 'EKW - Nr',
        placeholder: 'EKW - Nr',
        required: false,
        sortOrder: 1,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.shoppingCartNumber'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'shoppingCartContent',
        label: 'EKW - Inhalt',
        placeholder: 'EKW - Inhalt',
        required: false,
        sortOrder: 2,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.shoppingCartContent'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
        placeholder: 'Notizen',
        required: false,
        sortOrder: 3,
        controlType: 'TEXTAREA',
        show: selectedValues.includes('formFields.note'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'status',
        label: 'Status',
        placeholder: 'Status',
        required: false,
        sortOrder: 4,
        controlType: 'DROPDOWN',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'PLANNED', value: 'geplant' },
          { key: 'ORDERED', value: 'bestellt' },
          { key: 'APPROVED', value: 'genehmigt' },
          { key: 'DELIVERED', value: 'geliefert' },
        ]),
      })
    );

    return resultsArray;
  }

  private getRiskFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getShowFieldsSelection();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'description',
        label: 'Risikobezeichnung',
        placeholder: 'Risikobezeichnung',
        required: false,
        sortOrder: 1,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.description'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'value',
        label: 'Risikowert',
        placeholder: 'Risikowert',
        required: false,
        sortOrder: 2,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.value'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'solution',
        label: 'Abstellmaßnahme',
        placeholder: 'Abstellmaßnahme',
        required: false,
        sortOrder: 3,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.solution'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
        placeholder: 'Notizen',
        required: false,
        sortOrder: 4,
        controlType: 'TEXTAREA',
        show: selectedValues.includes('formFields.note'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'status',
        label: 'Status',
        placeholder: 'Status',
        required: false,
        sortOrder: 5,
        controlType: 'DROPDOWN',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'OPEN', value: 'offen' },
          { key: 'CLOSED', value: 'geschlossen' },
          { key: 'PLANNED', value: 'geplant' },
          { key: 'ASSIGNED', value: 'zugewiesen' },
          { key: 'IN_PROGRESS', value: 'in Bearbeitung' },
          { key: 'SUBMITTED', value: 'vorgelegt' },
          { key: 'DONE', value: 'fertiggestellt' },
        ]),
      })
    );

    return resultsArray;
  }

  private getSingleAppointmentFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getShowFieldsSelection();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'date',
        label: 'Datum',
        placeholder: 'Datum',
        required: false,
        sortOrder: 1,
        controlType: 'TEXTBOX',
        type: 'DATE',
        show: selectedValues.includes('formFields.date'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'goal',
        label: 'Zielzustand',
        placeholder: 'Zielzustand',
        required: false,
        sortOrder: 2,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.goal'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'responsiblePerson',
        label: 'Verantwortung',
        placeholder: 'Verantwortung',
        required: false,
        sortOrder: 3,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.responsiblePerson'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
        placeholder: 'Notizen',
        required: false,
        sortOrder: 4,
        controlType: 'TEXTAREA',
        show: selectedValues.includes('formFields.note'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'status',
        label: 'Status',
        placeholder: 'Status',
        required: false,
        sortOrder: 5,
        controlType: 'DROPDOWN',
        type: '',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'OPEN', value: 'offen' },
          { key: 'CLOSED', value: 'geschlossen' },
          { key: 'PLANNED', value: 'geplant' },
          { key: 'ASSIGNED', value: 'zugewiesen' },
          { key: 'IN_PROGRESS', value: 'in Bearbeitung' },
          { key: 'SUBMITTED', value: 'vorgelegt' },
          { key: 'DONE', value: 'fertiggestellt' },
        ]),
      })
    );
    return resultsArray;
  }

  private getAppointmentSeriesFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getShowFieldsSelection();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'appointment',
        label: 'Terminserie',
        placeholder: 'Terminserie',
        required: false,
        sortOrder: 1,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.appointment'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'participants',
        label: 'Teilnehmende',
        placeholder: 'Teilnehmende',
        required: false,
        sortOrder: 2,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.participants'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'link',
        label: 'Einwahllink',
        placeholder: 'Einwahllink',
        required: false,
        sortOrder: 3,
        controlType: 'TEXTBOX',
        type: 'URL',
        show: selectedValues.includes('formFields.link'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
        placeholder: 'Notizen',
        required: false,
        sortOrder: 4,
        controlType: 'TEXTAREA',
        show: selectedValues.includes('formFields.note'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'status',
        label: 'Status',
        placeholder: 'Status',
        required: false,
        sortOrder: 5,
        controlType: 'DROPDOWN',
        type: '',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'OPEN', value: 'offen' },
          { key: 'CLOSED', value: 'geschlossen' },
          { key: 'PLANNED', value: 'geplant' },
          { key: 'ASSIGNED', value: 'zugewiesen' },
          { key: 'IN_PROGRESS', value: 'in Bearbeitung' },
          { key: 'SUBMITTED', value: 'vorgelegt' },
          { key: 'DONE', value: 'fertiggestellt' },
        ]),
      })
    );
    return resultsArray;
  }

  private getStatusOptions(options: { key: string; value: string }[]): FormArray {
    const optionsArray = this.fb.array([]);

    for (const option of options) {
      optionsArray.push(
        this.fb.group({
          key: option.key,
          value: option.value,
        })
      );
    }

    return optionsArray;
  }
}
