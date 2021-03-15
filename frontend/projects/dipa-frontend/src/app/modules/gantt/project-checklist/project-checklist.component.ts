import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ProjectService, ProjectTask } from 'dipa-api-client';
import { MatVerticalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-project-checklist',
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
  public selectedTimelineId: number;

  public formGroup: FormGroup;

  public statusList = [
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

  public projectTasks: ProjectTask[];

  private projectChecklistSubscription: Subscription;

  public constructor(private projectService: ProjectService, public activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
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

  public ngOnDestroy(): void {
    this.projectChecklistSubscription?.unsubscribe();
  }

  public stepStatusChanged(stepper: MatVerticalStepper, completed: boolean): void {
    stepper.selected.completed = completed;
    stepper.selected.state = completed ? 'done' : 'number';
    // the icon of the step is not refreshed until the selectedIndex has changed
    const currentSelectedIndex = stepper.selectedIndex;
    stepper.selectedIndex = (currentSelectedIndex + 1) % stepper.steps.length;
    stepper.selectedIndex = currentSelectedIndex;
  }
}
