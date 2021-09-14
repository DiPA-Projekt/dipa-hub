import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FinalProjectTask, Project, ProjectService } from 'dipa-api-client';
import { switchMap } from 'rxjs/operators';
import { TimelineDataService } from '../../../shared/timelineDataService';
import ProjectSizeEnum = Project.ProjectSizeEnum;

@Component({
  selector: 'app-project-end',
  templateUrl: './project-end.component.html',
})
export class ProjectEndComponent implements OnInit, OnDestroy {
  public projectTasks: FinalProjectTask[];
  public selectedTimelineId: number;

  public timelineIdSubscription: Subscription;
  public projectDataSubscription: Subscription;
  public projectTasksSubscription: Subscription;

  private projectSize: ProjectSizeEnum;

  public constructor(
    public activatedRoute: ActivatedRoute,
    public projectService: ProjectService,
    private timelineDataService: TimelineDataService
  ) {}

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

    this.projectDataSubscription = this.timelineDataService.getProjectData().subscribe({
      next: (data: Project) => {
        if (data != null && this.projectSize !== data.projectSize) {
          this.projectSize = data.projectSize;
          this.reloadProjectTasks();
        }
      },
      error: null,
      complete: () => void 0,
    });
  }

  public ngOnDestroy(): void {
    this.timelineIdSubscription?.unsubscribe();
    this.projectDataSubscription?.unsubscribe();
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
