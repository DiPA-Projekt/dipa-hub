import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';
import { NonPermanentProjectTask, PermanentProjectTask, FinalProjectTask, ProjectService } from 'dipa-api-client';
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
export class ProjectChecklistComponent implements OnChanges, OnDestroy {
  @Input() public timelineId: number;
  @Input() public checklistType: string;
  @Input() public projectTasks: NonPermanentProjectTask[] | PermanentProjectTask[] | FinalProjectTask[];

  public formGroup: FormGroup;

  public showTasks: FormGroup;

  public visibleProjectTasks: NonPermanentProjectTask[] | PermanentProjectTask[] = [];
  public invisibleProjectTasks: NonPermanentProjectTask[] | PermanentProjectTask[] = [];

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

  private static moveTaskToArray(
    task: NonPermanentProjectTask | PermanentProjectTask,
    source: NonPermanentProjectTask[] | PermanentProjectTask[],
    target: NonPermanentProjectTask[] | PermanentProjectTask[]
  ): void {
    const index = source.indexOf(task);
    if (index !== -1) {
      const element = source[index];
      source.splice(index, 1);
      target.push(element);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectTasks && !changes.projectTasks.isFirstChange()) {
      this.visibleProjectTasks = this.projectTasks.filter((task) => task.sortOrder !== -1);
      this.invisibleProjectTasks = this.projectTasks.filter((task) => task.sortOrder === -1);
      this.projectTasks = [...this.visibleProjectTasks, ...this.invisibleProjectTasks];
    }
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

  public getTaskIcon(task: NonPermanentProjectTask | PermanentProjectTask): string {
    if (task.icon !== null) {
      return task.icon;
    }
    return task.projectTask.completed ? 'done' : 'number';
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.visibleProjectTasks, event.previousIndex, event.currentIndex);
    this.visibleProjectTasks.forEach(
      (task: NonPermanentProjectTask | PermanentProjectTask, index: number) => (task.sortOrder = index + 1)
    );
    this.projectTasks = [...this.visibleProjectTasks, ...this.invisibleProjectTasks];
    this.saveProjectTasks(this.visibleProjectTasks);
  }

  public setTaskVisibility(task: PermanentProjectTask, checked: boolean): void {
    if (checked) {
      task.sortOrder = this.maxTaskSortOrder() + 1;
      ProjectChecklistComponent.moveTaskToArray(task, this.invisibleProjectTasks, this.visibleProjectTasks);
    } else {
      task.sortOrder = -1;
      ProjectChecklistComponent.moveTaskToArray(task, this.visibleProjectTasks, this.invisibleProjectTasks);
    }
    this.projectTasks = [...this.visibleProjectTasks, ...this.invisibleProjectTasks];
    this.saveProjectTasks(this.projectTasks);
  }

  private maxTaskSortOrder(): number {
    return this.projectTasks.reduce((prev, current) => (prev.sortOrder > current.sortOrder ? prev : current)).sortOrder;
  }

  private saveProjectTasks(projectTasks: PermanentProjectTask[] | NonPermanentProjectTask[]): void {
    if (this.checklistType === 'permanentTasks') {
      this.projectService.updatePermanentProjectTasks(this.timelineId, projectTasks).subscribe({
        next: null,
        error: null,
        complete: () => void 0,
      });
    } else {
      this.projectService.updateNonPermanentProjectTasks(this.timelineId, this.visibleProjectTasks).subscribe({
        next: null,
        error: null,
        complete: () => void 0,
      });
    }
  }
}
