import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';
import { MaterialModule } from '../../material/material.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AngularResizeEventModule } from 'angular-resize-event';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared/shared.module';
import { GanttModule } from '../gantt/gantt.module';
import { ProjectsComponent } from './projects/projects.component';
import { ArchivedProjectsComponent } from './archived-projects/archived-projects.component';

@NgModule({
  declarations: [OverviewComponent, ProjectsComponent, ArchivedProjectsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    OverviewRoutingModule,
    SharedModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    AngularResizeEventModule,
    MatButtonModule,
    GanttModule,
  ],
})
export class OverviewModule {}
