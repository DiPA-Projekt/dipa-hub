import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Project, ProjectService, ProjectTask } from 'dipa-api-client';
import { switchMap } from 'rxjs/operators';
import { TimelineDataService } from '../../../shared/timelineDataService';

@Component({
  selector: 'app-project-control',
  templateUrl: './project-control.component.html',
})
export class ProjectControlComponent implements OnInit, OnDestroy {
  public projectTasks: ProjectTask[];

  public selectedTimelineId: number;
  public timelineIdSubscription: Subscription;
  public projectTasksSubscription: Subscription;

  public constructor(
    public activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private timelineDataService: TimelineDataService
  ) {}

  public ngOnInit(): void {
    this.timelineIdSubscription = this.activatedRoute.parent.parent.params
      .pipe(
        switchMap((params: Params): Observable<ProjectTask[]> => {
          this.selectedTimelineId = parseInt(params.id, 10);
          this.timelineDataService.setPermanentProjectTasks(this.selectedTimelineId);
          return this.timelineDataService.getPermanentProjectTasks();
        })
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
    this.projectTasksSubscription = this.projectService.getProjectPermanentTasks(this.selectedTimelineId).subscribe({
      next: (data: ProjectTask[]) => {
        this.projectTasks = data;
      },
      error: null,
      complete: () => void 0,
    });
  }
}
