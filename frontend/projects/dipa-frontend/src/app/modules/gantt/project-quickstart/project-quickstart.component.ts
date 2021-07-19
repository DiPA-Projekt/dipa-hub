import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ProjectService, NonPermanentProjectTask } from 'dipa-api-client';
import { switchMap } from 'rxjs/operators';
import { TimelineDataService } from '../../../shared/timelineDataService';

@Component({
  selector: 'app-project-quickstart',
  templateUrl: './project-quickstart.component.html',
})
export class ProjectQuickstartComponent implements OnInit, OnDestroy {
  public projectTasks: NonPermanentProjectTask[];

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
        switchMap((params: Params): Observable<NonPermanentProjectTask[]> => {
          this.selectedTimelineId = parseInt(params.id, 10);
          this.timelineDataService.setNonPermanentProjectTasks(this.selectedTimelineId);
          return this.timelineDataService.getNonPermanentProjectTasks();
        })
      )
      .subscribe({
        next: (data: NonPermanentProjectTask[]) => {
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
    this.timelineDataService.setNonPermanentProjectTasks(this.selectedTimelineId);
    this.projectTasksSubscription = this.timelineDataService.getNonPermanentProjectTasks().subscribe({
      next: (data: NonPermanentProjectTask[]) => {
        this.projectTasks = data;
      },
      error: null,
      complete: () => void 0,
    });
  }
}
