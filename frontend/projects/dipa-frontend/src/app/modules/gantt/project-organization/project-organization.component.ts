import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService, ProjectRole, User, UserService } from 'dipa-api-client';
import { forkJoin, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-project-organization',
  templateUrl: './project-organization.component.html',
  styleUrls: ['./project-organization.component.scss'],
})
export class ProjectOrganizationComponent implements OnInit, OnDestroy {
  public projectRoles: ProjectRole[];
  public allUsers: User[];

  public selectedTimelineId;
  private projectSubscription: Subscription;
  private usersSubscription: Subscription;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.projectSubscription = this.activatedRoute.parent.params.subscribe((params) => {
      this.selectedTimelineId = parseInt(params.id, 10);
    });
    this.projectSubscription = this.activatedRoute.parent.params
      .pipe(
        switchMap((params: Params) =>
          forkJoin(this.userService.getUsers(), this.projectService.getProjectRoles(parseInt(params.id, 10)))
        )
      )
      .subscribe(([allUsers, projectRoles]: [User[], ProjectRole[]]) => {
        this.projectRoles = projectRoles;
        this.allUsers = allUsers;
      });
  }

  public ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
  }
}
