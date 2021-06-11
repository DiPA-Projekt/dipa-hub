import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormField, ProjectService, ProjectTask, Result } from 'dipa-api-client';

@Component({
  selector: 'app-project-task-form',
  templateUrl: './project-task-form.component.html',
  styleUrls: ['./project-task-form.component.scss'],
})
export class ProjectTaskFormComponent implements OnInit {
  @Input() public completable: boolean;
  @Input() public taskData: ProjectTask;
  @Input() public selectedTimelineId: number;
  @Output() public stepStatusChanged = new EventEmitter();

  public formGroup: FormGroup;

  public selectedFields: string[];

  public constructor(private projectService: ProjectService, private fb: FormBuilder) {}

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
      validators.push(Validators.required);
    }

    return validators;
  }

  public ngOnInit(): void {
    this.setReactiveForm(this.taskData);
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
    console.log('submit');
    if (form.valid) {
      this.projectService.updateProjectTask(this.selectedTimelineId, form.value).subscribe({
        next: () => form.reset(form.value),
        error: null,
        complete: () => void 0,
      });
    } else {
      console.log('form not submitted');
    }
  }

  public onFocus(event: FocusEvent, path: (string | number)[]): void {
    const valueInput = event.target as HTMLInputElement;
    valueInput.setAttribute('data-value', this.formGroup.get(path).value || '');
    console.log('onFocus');
  }

  public onEscape(event: KeyboardEvent, path: (string | number)[]): void {
    const valueInput = event.target as HTMLInputElement;
    valueInput.value = valueInput.getAttribute('data-value');
    this.formGroup.get(path).setValue(valueInput.value);
    console.log('onEscape');
  }

  private setReactiveForm(data: ProjectTask): void {
    this.formGroup = this.fb.group({
      id: [data?.id],
      title: [data?.title],
      optional: [data?.optional],
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
        id: entry?.id,
        value: entry?.value,
        key: entry?.key,
        label: entry?.label,
        hint: entry?.hint,
        required: entry?.required,
        sortOrder: entry?.sortOrder,
        controlType: entry?.controlType,
        type: entry?.type,
        options: optionsArray,
        show: entry?.show,
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
          this.fb.group({
            id: entry?.id,
            resultType: entry?.resultType,
            formFields: this.getFormFieldsArray(entry?.formFields),
          })
        );
      }
    }
    return resultsArray;
  }
}
