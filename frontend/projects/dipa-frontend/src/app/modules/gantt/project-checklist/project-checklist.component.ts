import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';
import { ProjectTask } from 'dipa-api-client';
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
export class ProjectChecklistComponent implements OnDestroy {
  @Input() public timelineId: number;
  @Input() public checklistType: string;
  @Input() public projectTasks: ProjectTask[];

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

  private projectChecklistSubscription: Subscription;

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

  // public getTaskTitle(task: ProjectTask): string {
  //   return this.checklistType === 'permanentTasks' ? task.title : task.title;
  // }

  // public getTaskIcon(task: ProjectTask): string {
  //   if (this.checklistType === 'permanentTasks') {
  //     return task.icon;
  //   }
  //   return task.completed ? 'done' : 'number';
  // }
}
