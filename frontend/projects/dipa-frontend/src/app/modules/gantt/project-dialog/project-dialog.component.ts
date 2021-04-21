import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../authentication.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss'],
})
export class ProjectDialogComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<ProjectDialogComponent>
  ) {}

  ngOnInit(): void {
    var userData = this.authenticationService.getUserData();
    console.log(
      userData.subscribe((data) => {
        console.log(data);
      })
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
