import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';
import { NonPermanentProjectTask, PermanentProjectTask, ProjectService } from 'dipa-api-client';
import { MatVerticalStepper } from '@angular/material/stepper';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  @Input() public projectTasks: NonPermanentProjectTask[] | PermanentProjectTask[];

  public formGroup: FormGroup;

  public showTasks: FormGroup;

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

  public constructor(private projectService: ProjectService) {}

  public ngOnDestroy(): void {
    this.projectChecklistSubscription?.unsubscribe();
  }

  public get visibleProjectTasks(): PermanentProjectTask[] | NonPermanentProjectTask[] {
    return this.projectTasks.filter((task) => task.sortOrder !== -1);
  }

  public get invisibleProjectTasks(): PermanentProjectTask[] | NonPermanentProjectTask[] {
    return this.projectTasks.filter((task) => task.sortOrder === -1);
  }

  public stepStatusChanged(stepper: MatVerticalStepper, completed: boolean): void {
    stepper.selected.completed = completed;
    stepper.selected.state = completed ? 'done' : 'number';
    // the icon of the step is not refreshed until the selectedIndex has changed
    const currentSelectedIndex = stepper.selectedIndex;
    stepper.selectedIndex = (currentSelectedIndex + 1) % stepper.steps.length;
    stepper.selectedIndex = currentSelectedIndex;
  }

  public getTaskIcon(task: NonPermanentProjectTask | PermanentProjectTask): string {
    if (task.icon !== null) {
      return task.icon;
    }
    return task.projectTask.completed ? 'done' : 'number';
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.projectTasks, event.previousIndex, event.currentIndex);
    this.projectTasks.forEach(
      (task: NonPermanentProjectTask | PermanentProjectTask, index: number) => (task.sortOrder = index + 1)
    );
    if ('isAdditionalTask' in this.projectTasks[0]) {
      this.projectService.updatePermanentProjectTasks(this.timelineId, this.projectTasks).subscribe({
        next: null,
        error: null,
        complete: () => void 0,
      });
    } else {
      this.projectService.updateNonPermanentProjectTasks(this.timelineId, this.projectTasks).subscribe({
        next: null,
        error: null,
        complete: () => void 0,
      });
    }
  }

  public setTaskVisibility(task: PermanentProjectTask, checked: boolean): void {
    if (checked) {
      task.sortOrder = this.maxTaskSortOrder() + 1;
    } else {
      task.sortOrder = -1;
    }
  }

  private maxTaskSortOrder(): number {
    return this.projectTasks.reduce((prev, current) => (prev.sortOrder > current.sortOrder ? prev : current)).sortOrder;
  }
}
