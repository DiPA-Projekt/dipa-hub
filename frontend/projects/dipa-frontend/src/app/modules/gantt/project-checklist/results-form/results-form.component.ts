import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
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
  styleUrls: ['./results-form.component.scss', '../project-task-form/project-task-form.component.scss'],
})
export class ResultsFormComponent implements OnInit {
  @Input() public formData: FormArray;
  @Input() public statusList: OptionEntry[];
  @Input() public showFieldsForm: FormControl;
  @Input() public formFieldGroups: SelectOptionGroup[];
  @Input() public selectedFields: string[];
  @Output() public dataChanged = new EventEmitter();

  public currentResultType: ResultTypeEnum;

  public formGroup: FormGroup;

  public constructor(public formGroupDirective: FormGroupDirective, private fb: FormBuilder) {}

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

    this.setFormFieldGroups();
    const currentShowFields = this.showFieldsForm.value as string[];
    this.showFieldsForm.setValue([...currentShowFields, ...this.initSelectedFields()]);
  }

  public isValidUrl(formField: FormControl): boolean {
    const urlString = formField.value as string;
    return urlString?.length > 0 && formField.valid;
  }

  public onClickLink(formField: FormControl): void {
    const url = formField.get('value')?.value as string;

    if (this.isValidUrl(formField.get('value') as FormControl)) {
      window.open(url);
    }
  }

  public getFormFieldsArray(resultGroup: FormGroup): FormArray {
    return resultGroup.get(['formFields']) as FormArray;
  }

  public get resultsArray(): FormArray {
    return this.formGroup.get(['results']) as FormArray;
  }

  public addResult(resultType: ResultTypeEnum): void {
    this.resultsArray.push(this.getEmptyResult(resultType));
  }

  public getResultType(): ResultTypeEnum {
    if (!this.currentResultType) {
      if (this.formData.get([0])) {
        this.currentResultType = this.formData.get([0, 'resultType']).value as ResultTypeEnum;
      } else {
        this.currentResultType = ResultTypeEnum.TypeStd;
      }
    }
    return this.currentResultType;
  }

  public getSelectedFields(): string[] {
    return this.selectedFields || [];
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

  public getFormFieldClass(formField: FormGroup | AbstractControl): string {
    return formField.get('controlType')?.value === 'TEXTAREA' || formField.get('type')?.value === 'URL'
      ? 'width2x'
      : '';
  }

  public calculatePT(filterOptions: { key: string; value: string }): number {
    const filteredFormControls = this.getFilteredFormControls(filterOptions);

    return filteredFormControls
      .map(
        (x: FormGroup) =>
          parseInt(
            this.getFormFieldsArray(x)
              .controls.find((y) => y.get('key').value === 'PT')
              .get('value').value,
            10
          ) || 0
      )
      .reduce((acc, val) => acc + val, 0);
  }

  private getFilteredFormControls(filterOptions: { key: string; value: string }): FormGroup[] {
    const result: FormGroup[] = [];
    for (const resultControl of this.resultsArray.controls) {
      const formFieldsArray = this.getFormFieldsArray(resultControl as FormGroup);
      if (formFieldsArray?.length > 0) {
        for (const formFieldEntry of formFieldsArray.controls) {
          if (
            formFieldEntry.get('key').value === filterOptions.key &&
            formFieldEntry.get('value').value === filterOptions.value
          ) {
            result.push(resultControl as FormGroup);
            break;
          }
        }
      }
    }
    return result;
  }

  private initSelectedFields() {
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

      const resultTypeName = ResultsFormComponent.getResultTypeName(resultFormGroup.get('resultType').value);

      if (!this.formFieldGroups.find((formField) => formField.name === resultTypeName)) {
        this.formFieldGroups.push({
          name: resultTypeName,
          fields: groupValues,
        });
      }
    }
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
      case 'TYPE_SUBTASK':
        return this.fb.group({
          resultType: 'TYPE_SUBTASK',
          formFields: this.getSubtaskFormFields(),
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
      case 'TYPE_TEAM_PERS':
        return this.fb.group({
          resultType: 'TYPE_TEAM_PERS',
          formFields: this.getTeamPersonFormFields(),
        });
      case 'TYPE_LINK':
        return this.fb.group({
          resultType: 'TYPE_LINK',
          formFields: this.getLinkFormFields(),
        });
      default:
        break;
    }
  }

  private getStandardFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getSelectedFields();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
        hint: '',
        required: false,
        sortOrder: 1,
        controlType: 'TEXTAREA',
        show: selectedValues.includes('formFields.note'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'status',
        label: 'Status',
        hint: '',
        required: false,
        sortOrder: 2,
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
    const selectedValues = this.getSelectedFields();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'contactPerson',
        label: 'Name',
        hint: 'Ansprechpartner',
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
        key: 'department',
        label: 'Referat',
        hint: '',
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
        hint: '',
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
        key: 'note',
        label: 'Notizen',
        hint: '',
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
        hint: '',
        required: false,
        sortOrder: 5,
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

  private getSubtaskFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getSelectedFields();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'subtask',
        label: 'Aufgabe',
        hint: null,
        required: false,
        sortOrder: 1,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.subtask'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'contactPerson',
        label: 'Name',
        hint: 'Ansprechpartner',
        required: false,
        sortOrder: 2,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.contactPerson'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'department',
        label: 'Referat',
        hint: '',
        required: false,
        sortOrder: 3,
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
        hint: '',
        required: false,
        sortOrder: 4,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.taskArea'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
        hint: '',
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
        hint: '',
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
    const selectedValues = this.getSelectedFields();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'shoppingCartNumber',
        label: 'EKW - Nr',
        hint: '',
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
        hint: '',
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
        hint: '',
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
        hint: '',
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
    const selectedValues = this.getSelectedFields();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'description',
        label: 'Risikobezeichnung',
        hint: '',
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
        hint: '',
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
        hint: '',
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
        hint: '',
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
        hint: '',
        required: false,
        sortOrder: 5,
        controlType: 'DROPDOWN',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'ACTIVE', value: 'aktiv' },
          { key: 'OCCURRED', value: 'eingetreten' },
          { key: 'ELIMINATED', value: 'beseitigt' },
          { key: 'INACTIVE', value: 'inaktiv' },
          { key: 'RETURNED', value: 'zurückgestellt' },
        ]),
      })
    );

    return resultsArray;
  }

  private getSingleAppointmentFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getSelectedFields();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'date',
        label: 'Datum',
        hint: '',
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
        hint: '',
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
        hint: '',
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
        hint: '',
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
        hint: 'Status',
        required: false,
        sortOrder: 5,
        controlType: 'DROPDOWN',
        type: '',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'PLANNED', value: 'geplant' },
          { key: 'INVITED', value: 'eingeladen' },
          { key: 'DONE', value: 'durchgeführt' },
        ]),
      })
    );
    return resultsArray;
  }

  private getAppointmentSeriesFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getSelectedFields();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'serie',
        label: 'Name',
        hint: 'Name der Serie',
        required: false,
        sortOrder: 1,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.serie'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'date',
        label: 'Termin',
        hint: '',
        required: false,
        sortOrder: 2,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.date'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'participants',
        label: 'Teilnehmende',
        hint: '',
        required: false,
        sortOrder: 3,
        controlType: 'TEXTAREA',
        show: selectedValues.includes('formFields.participants'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'link',
        label: 'Einwahllink',
        hint: '',
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
        hint: '',
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
        hint: '',
        required: false,
        sortOrder: 6,
        controlType: 'DROPDOWN',
        type: '',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'PLANNED', value: 'geplant' },
          { key: 'INVITED', value: 'eingeladen' },
        ]),
      })
    );
    return resultsArray;
  }

  private getTeamPersonFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getSelectedFields();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'colleage',
        label: 'Name',
        hint: 'Teamkollege',
        required: false,
        sortOrder: 1,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.colleage'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'department',
        label: 'Referat',
        hint: '',
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
        hint: '',
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
        key: 'PT',
        label: 'PT',
        hint: 'Personentage',
        required: false,
        sortOrder: 4,
        controlType: 'TEXTBOX',
        type: 'NUMBER',
        show: selectedValues.includes('formFields.PT'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
        hint: 'Notizen',
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
        hint: 'Status',
        required: false,
        sortOrder: 6,
        controlType: 'DROPDOWN',
        type: '',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'PLANNED', value: 'geplant' },
          { key: 'BOOKED', value: 'besetzt' },
        ]),
      })
    );
    return resultsArray;
  }

  private getLinkFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getSelectedFields();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'name',
        label: 'Name',
        hint: '',
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
        key: 'documentationLink',
        label: 'Link',
        hint: '',
        required: false,
        sortOrder: 2,
        controlType: 'TEXTBOX',
        type: 'URL',
        show: selectedValues.includes('formFields.documentationLink'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
        hint: '',
        required: false,
        sortOrder: 3,
        controlType: 'TEXTAREA',
        show: selectedValues.includes('formFields.note'),
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
