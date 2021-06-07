import { Injectable } from '@angular/core';
import { Timeline, TimelinesService, UserService, User } from 'dipa-api-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimelineDataService {
  public timelines: BehaviorSubject<Timeline[]> = new BehaviorSubject<Timeline[]>(null);
  public roles: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public constructor(private timelinesService: TimelinesService, private userService: UserService) {}

  public getTimeline(): Observable<Timeline[]> {
    return this.timelines;
  }

  public setTimeline(): void {
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

  public getCurrentUserProjectRoles(userData: User, timelineId: number): string {
    const user: User = userData;
    const projectRolesString = [];

    const projectRoles = user.projectRoles.filter((role) => role.projectId === timelineId);
    projectRoles.sort((a) => (a.permission === 'WRITE' ? -1 : 1));
    projectRoles.map((role) => role.abbreviation).forEach((role) => projectRolesString.push(role));
    return projectRolesString.join(', ');
  }
}
