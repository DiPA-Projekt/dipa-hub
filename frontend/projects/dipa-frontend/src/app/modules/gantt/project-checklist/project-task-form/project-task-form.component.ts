import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormField, ProjectService, ProjectTask, Project, Result } from 'dipa-api-client';
import { TimelineDataService } from '../../../../shared/timelineDataService';
import { Subscription } from 'rxjs';
import { AppointmentSeriesValidator } from '../results-form/appt-series-validator';

@Component({
  selector: 'app-project-task-form',
  templateUrl: './project-task-form.component.html',
  styleUrls: ['./project-task-form.component.scss'],
})
export class ProjectTaskFormComponent implements OnInit, OnDestroy {
  @Input() public completable: boolean;
  @Input() public taskData: ProjectTask;
  @Input() public selectedTimelineId: number;
  @Output() public stepStatusChanged = new EventEmitter();

  public formGroup: FormGroup;

  public isArchivedProject: boolean;

  public selectedFields: string[];

  private projectDataSubscription: Subscription;

  public constructor(
    private projectService: ProjectService,
    private timelineDataService: TimelineDataService,
    private fb: FormBuilder,
    private appointmentSeriesValidator: AppointmentSeriesValidator
  ) {}

  public static getValidators(entry: FormField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    let typeValidator;

    switch (entry?.type) {
      case 'TEXT':
        break;
      case 'NUMBER':
        const numberPattern = '^[0-9]*$';
        typeValidator = Validators.pattern(numberPattern);
        break;
      case 'DATE':
        break;
      case 'URL':
        // this is a first basic url pattern with port
        const urlPattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})(:\\d+)?(.)*/?';
        typeValidator = Validators.pattern(urlPattern);
        break;
      case 'EMAIL':
        typeValidator = Validators.email;
        break;
    }

    if (typeValidator) {
      validators.push(typeValidator);
    }
    if (entry?.required === true) {
      validators.push(Validators.required.bind(this));
    }

    return validators;
  }

  public ngOnInit(): void {
    this.projectDataSubscription = this.timelineDataService.getProjectData().subscribe({
      next: (data: Project) => {
        if (this.isArchivedProject !== data.archived) {
          this.isArchivedProject = data.archived;
          this.setReactiveForm(this.taskData);
        }
      },
      error: null,
      complete: () => void 0,
    });
  }

  public ngOnDestroy(): void {
    this.projectDataSubscription?.unsubscribe();
  }

  public isValidUrl(entry: FormControl): boolean {
    const urlString = entry.value as string;
    return urlString?.length > 0 && entry.valid;
  }

  public onClickLink(entry: FormControl): void {
    const url = entry.get('value')?.value as string;

    if (this.isValidUrl(entry.get('value') as FormControl)) {
      window.open(url);
    }
  }

  public get entriesArray(): FormArray {
    return this.formGroup.get('entries') as FormArray;
  }

  public get resultsArray(): FormArray {
    return this.formGroup.get(['results']) as FormArray;
  }

  public changeShowSelection(): void {
    this.onSubmit(this.formGroup);
  }

  public toggleCompleteStatus(): void {
    const newStatus = !this.formGroup.get('completed').value;
    this.formGroup.get('completed').setValue(newStatus);
    this.onSubmit(this.formGroup);
    this.stepStatusChanged.emit(newStatus);
  }

  public onSubmit(form: FormGroup): void {
    if (form.valid) {
      this.projectService.updateProjectTask(this.selectedTimelineId, form.value).subscribe({
        next: () => form.reset(form.value),
        error: null,
        complete: () => void 0,
      });
    }
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

  private setReactiveForm(data: ProjectTask): void {
    this.formGroup = this.fb.group({
      id: [data?.id],
      explanation: [data?.explanation],
      completed: [data?.completed],
      entries: this.getFormFieldsArray(data?.entries),
      results: this.getResultsArray(data?.results),
    });
  }

  private getFormFieldsArray(entries: FormField[]): FormArray {
    const entriesArray = this.fb.array([]);

    for (const entry of entries) {
      const optionsArray = this.fb.array([]);

      for (const option of entry?.options) {
        optionsArray.push(
          this.fb.group({
            key: option?.key,
            value: option?.value,
          })
        );
      }

      const formGroup = this.fb.group({
        id: new FormControl({ value: entry?.id, disabled: this.isArchivedProject }),
        value: new FormControl({ value: entry?.value, disabled: this.isArchivedProject }),
        key: new FormControl({ value: entry?.key, disabled: this.isArchivedProject }),
        label: new FormControl({ value: entry?.label, disabled: this.isArchivedProject }),
        hint: new FormControl({ value: entry?.hint, disabled: this.isArchivedProject }),
        required: new FormControl({ value: entry?.required, disabled: this.isArchivedProject }),
        sortOrder: new FormControl({ value: entry?.sortOrder, disabled: this.isArchivedProject }),
        controlType: new FormControl({ value: entry?.controlType, disabled: this.isArchivedProject }),
        type: new FormControl({ value: entry?.type, disabled: this.isArchivedProject }),
        options: new FormControl({ value: entry?.options, disabled: this.isArchivedProject }),
        show: new FormControl({ value: entry?.show, disabled: this.isArchivedProject }),
      });

      const validators = ProjectTaskFormComponent.getValidators(entry);
      formGroup.get('value').setValidators(validators);

      entriesArray.push(formGroup);
    }
    return entriesArray;
  }

  private getResultsArray(results: Result[]): FormArray {
    const resultsArray = this.fb.array([]);

    if (results?.length) {
      for (const entry of results) {
        resultsArray.push(
          this.fb.group(
            {
              id: entry?.id,
              resultType: entry?.resultType,
              formFields: this.getFormFieldsArray(entry?.formFields),
            },
            {
              validators:
                entry?.resultType === 'TYPE_APPT_SERIES'
                  ? [
                      this.appointmentSeriesValidator.validRruleAndStatusSet(),
                      this.appointmentSeriesValidator.startBeforeEnd(),
                      this.appointmentSeriesValidator.statusMissingForEventCalculation(),
                    ]
                  : [],
            }
          )
        );
      }
    }
    return resultsArray;
  }
}
