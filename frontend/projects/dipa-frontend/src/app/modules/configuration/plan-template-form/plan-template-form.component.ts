import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  OperationType,
  OperationTypesService,
  PlanTemplate,
  ProjectApproach,
  ProjectApproachesService,
} from 'dipa-api-client';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-plan-template-form',
  templateUrl: './plan-template-form.component.html',
})
export class PlanTemplateFormComponent implements OnInit, OnDestroy {
  @Input() public result: PlanTemplate;
  @Input() public formGroup: FormGroup;
  @Input() public submitCallback: (param: any) => void;

  @Output() public formSubmitted = new EventEmitter<PlanTemplate>();
  @Output() public formValueChanged = new EventEmitter<FormGroup>();

  public operationTypesList: Array<OperationType> = [];
  public projectApproachesList: Array<ProjectApproach> = [];

  public operationTypeId;
  public projectApproachId;

  private dataSubscription: Subscription;

  public constructor(
    private fb: FormBuilder,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService
  ) {}

  public ngOnInit(): void {
    this.dataSubscription = forkJoin([
      this.operationTypesService.getOperationTypes(),
      this.projectApproachesService.getProjectApproaches(),
    ]).subscribe(([operationTypesList, projectApproachesList]) => {
      this.operationTypesList = operationTypesList;
      this.projectApproachesList = projectApproachesList;
    });

    this.setReactiveForm();
  }

  public ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  public submitForm(): void {
    this.onSubmit(this.formGroup);
  }

  public onSubmit(form: FormGroup): void {
    form.markAllAsTouched();
    if (form.valid) {
      this.formSubmitted.emit(form.value);
    }
  }

  public changeOperationType(event: MatSelectChange): void {
    this.formGroup.get(['projectApproaches', 0, 'id']).setValue(null);
  }

  public filterProjectApproaches(operationTypeId: number): Array<ProjectApproach> {
    return this.projectApproachesList.filter((projectApproach) => projectApproach.operationTypeId === operationTypeId);
  }

  public getProjectApproachesArray(resultGroup: FormGroup): FormArray {
    return resultGroup.get(['projectApproaches']) as FormArray;
  }

  private setReactiveForm(): void {
    this.formGroup = this.fb.group({
      id: this.result?.id || -1,
      name: this.result?.name,
      projectApproaches: this.getProjectApproaches(this.result?.projectApproaches),
    });
  }

  private getProjectApproaches(projectApproaches: Array<ProjectApproach>): FormArray {
    const projectApproachesArray = this.fb.array([]);

    projectApproaches.forEach((projectApproach) => {
      projectApproachesArray.push(
        this.fb.group({
          id: [projectApproach.id, Validators.required],
          name: projectApproach.name,
          operationTypeId: [projectApproach.operationTypeId, Validators.required],
        })
      );
    });

    return projectApproachesArray;
  }
}
