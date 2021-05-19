import { Component, Input, OnInit } from '@angular/core';
import { ProjectRole, ProjectService, User, UserService } from 'dipa-api-client';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-role',
  templateUrl: './project-role.component.html',
  styleUrls: ['./project-role.component.scss'],
})
export class ProjectRoleComponent implements OnInit {
  @Input() public role: ProjectRole;
  @Input() public allUsers: User[];
  @Input() public timelineId: number;

  public formGroup: FormGroup;
  public displayedColumns = ['name', 'action'];

  public constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.setReactiveForm();
  }

  public filterAllUsersInRole(role: ProjectRole): User[] {
    return this.allUsers.filter((user) => user.projectRoles.some((item) => item.id === role.id));
  }

  public filterAllUsersNotInRole(role: ProjectRole): User[] {
    return this.allUsers.filter((user) => !user.projectRoles.some((item) => item.id === role.id));
  }

  public onSubmit(formGroup: FormGroup, projectRole: ProjectRole): void {
    const user: User = formGroup.value.user;
    user.projectRoles.push(projectRole);

    if (projectRole.maxCount === 1) {
      const oldUsers = this.filterAllUsersInRole(projectRole);
      for (const oldUser of oldUsers) {
        if (user.id !== oldUser.id) {
          this.delete(oldUser, projectRole);
        }
      }
    }

    this.userService.updateUser(user).subscribe(() => void 0);
  }

  public delete(user: User, projectRole: ProjectRole): void {
    user.projectRoles = user.projectRoles.filter((role) => role.id !== projectRole.id);

    this.userService.updateUser(user).subscribe(() => void 0);
  }

  private setReactiveForm(): void {
    this.formGroup = this.fb.group({
      user: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
      role: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
    });
  }
}