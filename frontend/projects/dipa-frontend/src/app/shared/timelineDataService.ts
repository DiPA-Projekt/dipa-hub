import { Injectable } from '@angular/core';
import {
  Timeline,
  TimelinesService,
  UserService,
  User,
  ProjectService,
  Project,
  NonPermanentProjectTask,
  PermanentProjectTask,
  RecurringEventType,
} from 'dipa-api-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimelineDataService {
  public timelines: BehaviorSubject<Timeline[]> = new BehaviorSubject<Timeline[]>(null);
  public projectData: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
  public roles: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public nonPermanentProjectTasks: BehaviorSubject<NonPermanentProjectTask[]> = new BehaviorSubject<
    NonPermanentProjectTask[]
  >(null);
  public permanentProjectTasks: BehaviorSubject<PermanentProjectTask[]> = new BehaviorSubject<PermanentProjectTask[]>(
    null
  );
  public recurringEvents: BehaviorSubject<RecurringEventType[]> = new BehaviorSubject<RecurringEventType[]>(null);

  public constructor(
    private timelinesService: TimelinesService,
    private userService: UserService,
    private projectService: ProjectService
  ) {
    this.setTimelines();
    this.setRecurringEvents();
  }

  public getTimelines(): Observable<Timeline[]> {
    return this.timelines;
  }

  public setTimelines(): void {
    this.timelinesService.getTimelines().subscribe({
      next: (data: Timeline[]) => {
        this.timelines.next(data);
      },
      error: null,
      complete: () => void 0,
    });
  }

  public getRoles(): Observable<string> {
    return this.roles;
  }

  public setRoles(timelineId: number): void {
    this.userService.getCurrentUser().subscribe((data: User) => {
      this.roles.next(this.getCurrentUserProjectRoles(data, timelineId));
    });
  }

  public getProjectData(): Observable<Project> {
    return this.projectData;
  }

  public setProjectData(timelineId: number): void {
    this.projectService.getProjectData(timelineId).subscribe((data: Project) => {
      this.projectData.next(data);
    });
  }

  public getNonPermanentProjectTasks(): Observable<NonPermanentProjectTask[]> {
    return this.nonPermanentProjectTasks;
  }

  public setNonPermanentProjectTasks(timelineId: number): void {
    this.projectService.getNonPermanentProjectTasks(timelineId).subscribe((data: NonPermanentProjectTask[]) => {
      this.nonPermanentProjectTasks.next(data);
    });
  }

  public getPermanentProjectTasks(): Observable<PermanentProjectTask[]> {
    return this.permanentProjectTasks;
  }

  public setPermanentProjectTasks(timelineId: number): void {
    this.projectService.getPermanentProjectTasks(timelineId).subscribe((data: PermanentProjectTask[]) => {
      this.permanentProjectTasks.next(data);
    });
  }

  public getCurrentUserProjectRoles(userData: User, timelineId: number): string {
    const user: User = userData;
    const projectRolesString = [];

    const projectRoles = user.projectRoles.filter((role) => role.projectId === timelineId);
    projectRoles.sort((a) => (a.permission === 'WRITE' ? -1 : 1));
    projectRoles.map((role) => role.abbreviation).forEach((role) => projectRolesString.push(role));
    return projectRolesString.join(', ');
  }

  public getRecurringEvents(): Observable<RecurringEventType[]> {
    return this.recurringEvents;
  }

  public setRecurringEvents(): void {
    this.projectService.getRecurringEventTypes().subscribe((data: RecurringEventType[]) => {
      this.recurringEvents.next(data);
    });
  }
}
