import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDialogComponent } from '../modules/gantt/project-dialog/project-dialog.component';

@Component({
  selector: 'app-root-component',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent {
  public constructor(private authenticationService: AuthenticationService, public dialog: MatDialog) {}

  public isUserInOrganisationRoles(role: string): boolean {
    return this.authenticationService.isUserInOrganisationRoles(role);
  }

  public hasProjectRoles(): boolean {
    return this.authenticationService.getProjectRolesAfterLoggedIn().length > 0;
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public openProjectDialog(): void {
    this.dialog.open(ProjectDialogComponent, {
      height: '80vh',
      width: '80vw',
    });
  }
}
