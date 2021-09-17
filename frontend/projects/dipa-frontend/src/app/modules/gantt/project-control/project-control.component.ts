import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Project, ProjectService, PermanentProjectTask } from 'dipa-api-client';
import { switchMap } from 'rxjs/operators';
import { TimelineDataService } from '../../../shared/timelineDataService';
import ProjectSizeEnum = Project.ProjectSizeEnum;

@Component({
  selector: 'app-project-control',
  templateUrl: './project-control.component.html',
})
export class ProjectControlComponent implements OnInit, OnDestroy {
  public projectTasks: PermanentProjectTask[];
  public selectedTimelineId: number;

  public timelineIdSubscription: Subscription;
  public projectDataSubscription: Subscription;
  public projectTasksSubscription: Subscription;

  private projectSize: ProjectSizeEnum;

  public constructor(
    public activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private timelineDataService: TimelineDataService
  ) {}

  public ngOnInit(): void {
    this.timelineIdSubscription = this.activatedRoute.parent.parent.params
      .pipe(
        switchMap((params: Params): Observable<PermanentProjectTask[]> => {
          this.selectedTimelineId = parseInt(params.id, 10);
          this.timelineDataService.setPermanentProjectTasks(this.selectedTimelineId);
          return this.timelineDataService.getPermanentProjectTasks();
        })
      )
      .subscribe({
        next: (data: PermanentProjectTask[]) => {
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
    this.projectDataSubscription?.unsubscribe();
    this.timelineIdSubscription?.unsubscribe();
    this.projectTasksSubscription?.unsubscribe();
  }

  public reloadProjectTasks(): void {
    this.timelineDataService.setPermanentProjectTasks(this.selectedTimelineId);
    this.projectTasksSubscription = this.timelineDataService.getPermanentProjectTasks().subscribe({
      next: (data: PermanentProjectTask[]) => {
        this.projectTasks = data;
      },
      error: null,
      complete: () => void 0,
    });
  }
}
