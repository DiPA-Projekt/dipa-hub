import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Project, ProjectService, PermanentProjectTask } from 'dipa-api-client';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-project-control',
  templateUrl: './project-control.component.html',
})
export class ProjectControlComponent implements OnInit, OnDestroy {
  public projectTasks: PermanentProjectTask[];

  public selectedTimelineId: number;
  public timelineIdSubscription: Subscription;
  public projectTasksSubscription: Subscription;

  public constructor(public activatedRoute: ActivatedRoute, private projectService: ProjectService) {}

  public ngOnInit(): void {
    this.timelineIdSubscription = this.activatedRoute.parent.parent.params
      .pipe(
        switchMap(
          (params: Params): Observable<PermanentProjectTask[]> => {
            this.selectedTimelineId = parseInt(params.id, 10);
            return this.projectService.getPermanentProjectTasks(this.selectedTimelineId);
          }
        )
      )
      .subscribe({
        next: (data: Project[]) => {
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
    this.projectTasksSubscription = this.projectService.getPermanentProjectTasks(this.selectedTimelineId).subscribe({
      next: (data: PermanentProjectTask[]) => {
        this.projectTasks = data;
      },
      error: null,
      complete: () => void 0,
    });
  }
}
