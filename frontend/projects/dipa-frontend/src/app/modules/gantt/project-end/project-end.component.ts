import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FinalProjectTask, ProjectService } from 'dipa-api-client';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-project-end',
  templateUrl: './project-end.component.html',
})
export class ProjectEndComponent implements OnInit, OnDestroy {
  public selectedTimelineId: number;
  public timelineIdSubscription: Subscription;

  public projectTasksSubscription: Subscription;
  public projectTasks: FinalProjectTask[];

  public constructor(public activatedRoute: ActivatedRoute, public projectService: ProjectService) {}

  public ngOnInit(): void {
    this.timelineIdSubscription = this.activatedRoute.parent.parent.params
      .pipe(
        switchMap((params: Params): Observable<FinalProjectTask[]> => {
          this.selectedTimelineId = parseInt(params.id, 10);
          return this.projectService.getFinalProjectTasks(this.selectedTimelineId);
        })
      )
      .subscribe({
        next: (data: FinalProjectTask[]) => {
          this.projectTasks = data;
        },
        error: null,
        complete: () => void 0,
      });
  }

  public ngOnDestroy(): void {
    this.timelineIdSubscription?.unsubscribe();
    this.projectTasksSubscription?.unsubscribe();
  }

  public reloadProjectTasks(): void {
    this.projectTasksSubscription = this.projectService.getFinalProjectTasks(this.selectedTimelineId).subscribe({
      next: (data: FinalProjectTask[]) => {
        this.projectTasks = data;
      },
      error: null,
      complete: () => void 0,
    });
  }
}
