import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

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
  public projectUsers: User[];
  public allUsers: User[];

  public displayedColumns = ['name', 'role'];
  public formGroup: FormGroup;
  public userRolesDict = {};
  private selectedTimelineId;
  private projectSubscription: Subscription;
  private usersSubscription: Subscription;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.projectSubscription = this.activatedRoute.parent.params.subscribe((params) => {
      this.selectedTimelineId = parseInt(params.id, 10);
    });
    this.projectSubscription = this.activatedRoute.parent.params
      .pipe(
        switchMap((params: Params) =>
          forkJoin(
            this.userService.getUsers(),
            this.projectService.getProjectRoles(parseInt(params.id, 10)),
            this.projectService.getProjectUsers(parseInt(params.id, 10))
          )
        )
      )
      .subscribe(([allUsers, projectRoles, projectUsers]: [User[], ProjectRole[], User[]]) => {
        this.projectRoles = projectRoles;
        this.projectUsers = projectUsers;

        this.filterAllUsers(allUsers);

        this.saveRolesId();
      });

    this.setReactiveForm();
  }

  public ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
  }

  public saveRolesId(): void {
    for (const user of this.projectUsers) {
      const roles = this.filterRole(user);
      this.userRolesDict[user.id] = roles;
    }
  }

  public filterRole(user: User): number[] {
    return user.projectRoles
      .filter((role) => role.projectId.toString() === this.selectedTimelineId.toString())
      .map((role) => role.id);
  }

  public onSubmitRole(value: number[], user: User): void {
    const oldRoles = this.filterRole(user);

    user.projectRoles = user.projectRoles.filter((role) => !oldRoles.includes(role.id));
    this.projectRoles.filter((role) => value.includes(role.id)).forEach((role) => user.projectRoles.push(role));

    this.userService.updateUser(user).subscribe((data) => {
      this.filterAllUsers(this.allUsers);
      this.saveRolesId();
    });
  }

  public onSubmit(formGroup): void {
    let user: User = formGroup.value.user;
    user.projectRoles.push(formGroup.value.role);

    this.userService.updateUser(user).subscribe((data) =>
      this.projectService.getProjectUsers(this.selectedTimelineId).subscribe((res) => {
        this.projectUsers = res;
        this.filterAllUsers(this.allUsers);
        this.saveRolesId();
        this.setReactiveForm();
      })
    );
  }

  private setReactiveForm(): void {
    this.formGroup = this.fb.group({
      user: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      role: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
    });
  }

  private filterAllUsers(allUsers: User[]): void {
    const projectUsersIds: number[] = [];
    this.projectUsers.forEach((u) => projectUsersIds.push(u.id));
    this.allUsers = allUsers.filter((user) => !projectUsersIds.includes(user.id));
  }
}
