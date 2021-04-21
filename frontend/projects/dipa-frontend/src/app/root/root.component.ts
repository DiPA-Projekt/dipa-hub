import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDialogComponent } from '../modules/gantt/project-dialog/project-dialog.component';
// import { ProjectDialogComponent } from './project-dialog/project-dialog.component';

@Component({
  selector: 'app-root-component',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent {
  constructor(
    private authenticationService: AuthenticationService,
    public dialog: MatDialog // private projectDialog: ProjectDialogComponent
  ) {}

  public isUserInRole(role: string): boolean {
    return this.authenticationService.isUserInRole(role);
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public openProjectDialog(): void {
    this.dialog.open(ProjectDialogComponent);
  }
}
