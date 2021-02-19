import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ProjectService, ProjectTask } from 'dipa-api-client';

@Component({
  selector: 'app-vertical-stepper',
  templateUrl: './project-checklist.component.html',
  styleUrls: ['./project-checklist.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class ProjectChecklistComponent implements OnInit, OnDestroy {
  projectChecklistSubscription: Subscription;

  selectedTimelineId: number;

  isLinear = false;

  formGroup: FormGroup;

  statusList = [
    {
      value: 'IN_PROGRESS',
      name: 'in Bearbeitung',
    },
    {
      value: 'OPEN',
      name: 'offen',
    },
    {
      value: 'CLOSED',
      name: 'geschlossen',
    },
    {
      value: 'ASSIGNED',
      name: 'zugewiesen',
    },
    {
      value: 'PLANNED',
      name: 'geplant',
    },
    {
      value: 'DONE',
      name: 'fertiggestellt',
    },
  ];

  projectTasks: ProjectTask[];

  constructor(private projectService: ProjectService, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectChecklistSubscription = this.activatedRoute.parent.params
      .pipe(
        switchMap(
          (params: Params): Observable<ProjectTask[]> => {
            this.selectedTimelineId = parseInt(params.id, 10);
            return this.projectService.getProjectTasks(this.selectedTimelineId);
          }
        )
      )
      .subscribe((data: ProjectTask[]) => {
        this.projectTasks = data;
      });
  }

  ngOnDestroy(): void {
    this.projectChecklistSubscription?.unsubscribe();
  }
}
