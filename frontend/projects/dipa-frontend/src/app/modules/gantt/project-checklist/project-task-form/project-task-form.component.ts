import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormField, ProjectService, ProjectTask, Result } from 'dipa-api-client';
import { MatSelectChange } from '@angular/material/select';

interface SelectOption {
  value: string;
  viewValue: string;
}

interface SelectOptionGroup {
  name: string;
  fields: SelectOption[];
}

@Component({
  selector: 'app-project-task-form',
  templateUrl: './project-task-form.component.html',
  styleUrls: ['./project-task-form.component.scss'],
})
export class ProjectTaskFormComponent implements OnInit {
  @Input() public taskData: ProjectTask;
  @Input() public selectedTimelineId: number;
  @Output() public stepStatusChanged = new EventEmitter();

  public formFieldGroups: SelectOptionGroup[] = [];

  public formGroup: FormGroup;

  public showFieldsForm: FormControl;

  public selectedFields: string[];

  public constructor(private projectService: ProjectService, private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.setReactiveForm(this.taskData);
    this.showFieldsForm = new FormControl(this.getSelectedFields());
  }

  public get entriesArray(): FormArray {
    return this.formGroup.get('entries') as FormArray;
  }

  public get resultsArray(): FormArray {
    return this.formGroup.get(['results']) as FormArray;
  }

  public changeShowSelection(event: MatSelectChange): void {
    this.selectedFields = event.value as string[];

    for (const entry of this.entriesArray.controls) {
      const showItem = this.selectedFields.includes(entry.get('key').value);
      entry.get('show').setValue(showItem);
    }

    for (const result of this.resultsArray.controls) {
      const formFieldsArray = result.get('formFields') as FormArray;

      for (const ffEntry of formFieldsArray.controls) {
        const currentKey = ffEntry.get('key').value as string;
        const showItem = this.selectedFields.includes(`formFields.${currentKey}`);
        ffEntry.get('show').setValue(showItem);
      }
    }

    this.onSubmit(this.formGroup);
  }

  public toggleCompleteStatus(): void {
    const newStatus = !this.formGroup.get('completed').value;
    this.formGroup.get('completed').setValue(newStatus);
    this.onSubmit(this.formGroup);
    this.stepStatusChanged.emit(newStatus);
  }

  public onSubmit(form: FormGroup): void {
    this.projectService.updateProjectTask(this.selectedTimelineId, form.value).subscribe({
      next: () => form.reset(form.value),
      error: null,
      complete: () => void 0,
    });
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

  private getSelectedFields(): string[] {
    this.selectedFields = [];

    for (const entry of this.entriesArray.controls) {
      if (entry.get('show').value) {
        this.selectedFields.push(entry.get('key').value);
      }
    }

    return this.selectedFields;
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

      entriesArray.push(
        this.fb.group({
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
        })
      );
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
