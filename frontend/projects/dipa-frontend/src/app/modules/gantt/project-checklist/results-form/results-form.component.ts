import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { OptionEntry, Result, TimelinesService } from 'dipa-api-client';
import ResultTypeEnum = Result.ResultTypeEnum;
import { AppointmentSeriesValidator } from './appt-series-validator';
import { DatePipe } from '@angular/common';

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
  @Input() public isEditable: boolean;
  @Input() public formData: FormArray;
  @Input() public selectedTimelineId: number;
  @Input() public statusList: OptionEntry[];
  @Input() public selectedFields: string[];
  @Output() public showSelectionChanged = new EventEmitter();
  @Output() public dataChanged = new EventEmitter();

  public formFieldGroups: SelectOptionGroup[] = [];

  public currentResultType: ResultTypeEnum;

  public formGroup: FormGroup;

  public apptStartDate: string;
  public apptEndDate: string;

  public constructor(
    public formGroupDirective: FormGroupDirective,
    private fb: FormBuilder,
    private timelineService: TimelinesService,
    private datePipe: DatePipe,
    private appointmentSeriesValidator: AppointmentSeriesValidator
  ) {}

  public ngOnInit(): void {
    this.formGroup = this.formGroupDirective.control;

    this.apptStartDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    if (this.apptEndDate == null) {
      this.timelineService.getTimelines().subscribe((data) => {
        const selectedTimeline = data.find((c) => c.id === Number(this.selectedTimelineId));
        this.apptEndDate = this.datePipe.transform(new Date(selectedTimeline.end), 'yyyy-MM-dd');
      });
    }

    this.initSelectedFields();
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

  public get entriesArray(): FormArray {
    return this.formGroup.get('entries') as FormArray;
  }

  public addResult(resultType: ResultTypeEnum): void {
    this.initSelectedFields();
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

  // public getFormFieldClass(formField: FormGroup | AbstractControl): string {
  //   return formField.get('controlType')?.value === 'TEXTAREA' || formField.get('type')?.value === 'URL'
  //     ? 'full-width'
  //     : 'full-width';
  // }

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
        return this.fb.group(
          {
            resultType: 'TYPE_APPT_SERIES',
            formFields: this.getAppointmentSeriesFormFields(),
          },
          {
            validators: [
              this.appointmentSeriesValidator.validRruleAndStatusSet(),
              this.appointmentSeriesValidator.startBeforeEnd(),
              this.appointmentSeriesValidator.statusMissingForEventCalculation(),
            ],
          }
        );
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
        required: false,
        sortOrder: 2,
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

  private getContactPersonFormFields(): FormArray {
    const resultsArray = this.fb.array([]);
    const selectedValues = this.getSelectedFields();

    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'contactPerson',
        label: 'Ansprechpartner',
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
        label: 'Ansprechpartner',
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
        key: 'responsible_person',
        label: 'Verantwortung',
        required: false,
        sortOrder: 3,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: selectedValues.includes('formFields.responsible_person'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'note',
        label: 'Notizen',
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
        required: false,
        sortOrder: 5,
        controlType: 'DROPDOWN',
        show: selectedValues.includes('formFields.status'),
        options: this.getStatusOptions([
          { key: 'OPEN', value: 'offen' },
          { key: 'CLOSED', value: 'geschlossen' },
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
        value: new FormControl('', { validators: [Validators.required] }),
        key: 'serie',
        label: 'Name der Serie',
        required: true,
        sortOrder: 1,
        controlType: 'TEXTBOX',
        type: 'TEXT',
        show: true,
      })
    );
    resultsArray.push(
      this.fb.group({
        value: new FormControl(this.datePipe.transform(new Date(), 'HH:mm'), { validators: [Validators.required] }),
        key: 'startTime',
        label: 'Termin',
        required: true,
        sortOrder: 2,
        controlType: 'TEXTBOX',
        type: 'TIME',
        show: true,
      })
    );
    resultsArray.push(
      this.fb.group({
        value: new FormControl(1, { validators: [Validators.required] }),
        key: 'duration',
        label: 'Dauer',
        required: true,
        sortOrder: 3,
        controlType: 'TEXTBOX',
        type: 'NUMBER',
        show: true,
      })
    );
    resultsArray.push(
      this.fb.group({
        value: 'FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=1',
        key: 'appointment',
        label: 'Terminregel',
        required: true,
        sortOrder: 4,
        controlType: 'RRULE',
        show: selectedValues.includes('formFields.appointment'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: new FormControl(this.apptStartDate, { validators: [Validators.required] }),
        key: 'startDate',
        label: 'Beginn',
        required: true,
        sortOrder: 5,
        controlType: 'TEXTBOX',
        type: 'DATE',
        show: true,
      })
    );
    resultsArray.push(
      this.fb.group({
        value: new FormControl(this.apptEndDate, { validators: [Validators.required] }),
        key: 'endDate',
        label: 'Ende',
        required: true,
        sortOrder: 6,
        controlType: 'TEXTBOX',
        type: 'DATE',
        show: true,
      })
    );
    resultsArray.push(
      this.fb.group({
        value: new FormControl('', { validators: [Validators.required] }),
        key: 'participants',
        label: 'Teilnehmende',
        required: true,
        sortOrder: 7,
        controlType: 'LIST',
        show: true,
      })
    );
    resultsArray.push(
      this.fb.group({
        value: '',
        key: 'link',
        label: 'Einwahllink',
        required: false,
        sortOrder: 8,
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
        required: false,
        sortOrder: 9,
        controlType: 'TEXTAREA',
        show: selectedValues.includes('formFields.note'),
      })
    );
    resultsArray.push(
      this.fb.group({
        value: new FormControl('', { validators: [Validators.required] }),
        key: 'status',
        label: 'Status',
        required: true,
        sortOrder: 10,
        controlType: 'DROPDOWN',
        show: true,
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
        label: 'Teamkollege',
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
        label: 'Personentage (PT)',
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
        required: false,
        sortOrder: 6,
        controlType: 'DROPDOWN',
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
