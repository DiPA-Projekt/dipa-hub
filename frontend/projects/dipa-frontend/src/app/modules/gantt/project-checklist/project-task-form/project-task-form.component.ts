import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService, ProjectTask } from 'dipa-api-client';

@Component({
  selector: 'app-project-task-form',
  templateUrl: './project-task-form.component.html',
  styleUrls: ['./project-task-form.component.scss'],
})
export class ProjectTaskFormComponent implements OnInit {
  @Input() taskData;
  @Input() selectedTimelineId;

  formGroup: FormGroup;

  cartStatusList = [
    {
      value: 'PLANNED',
      name: 'geplant',
    },
    {
      value: 'ORDERED',
      name: 'bestellt',
    },
    {
      value: 'APPROVED',
      name: 'genehmigt',
    },
    {
      value: 'DELIVERED',
      name: 'geliefert',
    },
  ];

  standardStatusList = [
    {
      value: 'OPEN',
      name: 'offen',
    },
    {
      value: 'CLOSED',
      name: 'geschlossen',
    },
    {
      value: 'PLANNED',
      name: 'geplant',
    },
    {
      value: 'ASSIGNED',
      name: 'zugewiesen',
    },
    {
      value: 'IN_PROGRESS',
      name: 'in Bearbeitung',
    },
    {
      value: 'SUBMITTED',
      name: 'vorgelegt',
    },
    {
      value: 'DONE',
      name: 'fertiggestellt',
    },
  ];

  personStatusList = [
    {
      value: 'OPEN',
      name: 'offen',
    },
    {
      value: 'CONTACTED',
      name: 'angesprochen',
    },
    {
      value: 'ANSWER_RECEIVED',
      name: 'Antwort erhalten',
    },
    {
      value: 'DONE',
      name: 'abgeschlossen',
    },
  ];

  constructor(private projectService: ProjectService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setReactiveForm(this.taskData);
  }

  setReactiveForm(data: ProjectTask): void {
    this.formGroup = this.fb.group({
      id: [data?.id],
      title: [data?.title],
      optional: [data?.optional],
      explanation: [data?.explanation],
      contactPerson: [data?.contactPerson],
      documentationLink: [data?.documentationLink],
      results: this.fb.group({
        type: '',
        data: this.fb.array([]),
      }),
    });
  }

  onSubmit(form: FormGroup): void {
    this.projectService.updateProjectTask(this.selectedTimelineId, form.value).subscribe(() => {
      form.reset(form.value);
    });
  }
}
