import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormField, ProjectService, ProjectTask } from 'dipa-api-client';
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

  formFieldGroups: SelectOptionGroup[] = [];

  public formGroup: FormGroup;

  public showFieldsForm: FormControl;

  public constructor(private projectService: ProjectService, private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.setReactiveForm(this.taskData);
    this.showFieldsForm = new FormControl(this.getShowFieldsSelection());
  }

  public get entriesArray(): FormArray {
    return this.formGroup.get('entries') as FormArray;
  }

  public changeShowSelection(event: MatSelectChange): void {
    const selectedValues = event.value as string[];

    for (const entry of this.entriesArray.controls) {
      const showItem = selectedValues.includes(entry.get('key').value);
      entry.get('show').setValue(showItem);
    }

    for (const formFieldGroup of this.formFieldGroups) {
      for (const field of formFieldGroup.fields) {
        console.log('Überprüfe für: ' + field.value);

        const dataArray = this.getCurrentResultsDataArray();
        for (const controls of dataArray.controls) {
          const formFieldsArray = controls.get('formFields') as FormArray;
          console.log(controls.get('formFields'));

          for (const ffEntry of formFieldsArray.controls) {
            const currentKey = ffEntry.get('key').value as string;
            const showItem = selectedValues.includes(`formFields.${currentKey}`);
            ffEntry.get('show').setValue(showItem);

            console.log(ffEntry);
          }
        }
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
    this.projectService.updateProjectTask(this.selectedTimelineId, form.value).subscribe(() => {
      form.reset(form.value);
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

  private getShowFieldsSelection(): string[] {
    const selectedValues: string[] = [];

    // TODO: push auch die formFields
    for (const entry of this.entriesArray.controls) {
      if (entry.get('show').value) {
        selectedValues.push(entry.get('key').value);
      }
    }

    return selectedValues;
  }

  private setReactiveForm(data: ProjectTask): void {
    this.formGroup = this.fb.group({
      id: [data?.id],
      title: [data?.title],
      optional: [data?.optional],
      explanation: [data?.explanation],
      completed: [data?.completed],
      //entries: [data?.entries],
      entries: this.getEntriesArray(data?.entries),
      // contactPerson: [data?.contactPerson],
      // documentationLink: [data?.documentationLink],
      results: this.fb.group({
        type: '',
        data: this.fb.array([]),
      }),
    });
  }

  private getEntriesArray(entries: FormField[]): FormArray {
    const entriesArray = this.fb.array([]);

    for (const entry of entries) {
      entriesArray.push(
        this.fb.group({
          id: entry?.id,
          value: entry?.value,
          key: entry?.key,
          label: entry?.label,
          placeholder: entry?.placeholder,
          required: entry?.required,
          sortOrder: entry?.sortOrder,
          controlType: entry?.controlType,
          type: entry?.type,
          options: entry?.options,
          show: entry?.show,
        })
      );
    }
    return entriesArray;
  }

  private getCurrentResultsDataArray(): FormArray {
    return this.formGroup.get(['results', 'data']) as FormArray;
  }
}
