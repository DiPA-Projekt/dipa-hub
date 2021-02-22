import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanttRoutingModule } from './gantt-routing.module';
import { GanttComponent } from './gantt.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AngularResizedEventModule } from 'angular-resize-event';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NavMenuListItemComponent } from '../../shared/nav-menu-list-item/nav-menu-list-item.component';
import { ProjectDataComponent } from './project-data/project-data.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TemplatesComponent } from './templates-view/templates/templates.component';
import { TemplatesViewComponent } from './templates-view/templates-view.component';
import { FilesComponent } from './files/files.component';
import { ChartComponent } from './chart/chart.component';
import { MatRadioModule } from '@angular/material/radio';
import { TimelineComponent } from './timeline/timeline.component';
import { ProjectChecklistComponent } from './project-checklist/project-checklist.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ChartHeaderComponent } from './chart/chart-header/chart-header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProjectTaskFormComponent } from './project-checklist/project-task-form/project-task-form.component';
import { CartFormComponent } from './project-checklist/cart-form/cart-form.component';
import { RiskFormComponent } from './project-checklist/risk-form/risk-form.component';
import { SingleAppointmentFormComponent } from './project-checklist/single-appointment-form/single-appointment-form.component';
import { AppointmentSeriesFormComponent } from './project-checklist/appointment-series-form/appointment-series-form.component';
import { ContactPersonFormComponent } from './project-checklist/contact-person-form/contact-person-form.component';
import { StandardTaskFormComponent } from './project-checklist/standard-form/standard-task-form.component';

@NgModule({
  declarations: [
    GanttComponent,
    NavMenuListItemComponent,
    ProjectDataComponent,
    SidenavComponent,
    TemplatesComponent,
    TemplatesViewComponent,
    SidenavComponent,
    FilesComponent,
    ChartComponent,
    TimelineComponent,
    ProjectChecklistComponent,
    ChartHeaderComponent,
    ProjectTaskFormComponent,
    CartFormComponent,
    RiskFormComponent,
    SingleAppointmentFormComponent,
    AppointmentSeriesFormComponent,
    ContactPersonFormComponent,
    StandardTaskFormComponent,
  ],
  exports: [ChartComponent, FilesComponent, NavMenuListItemComponent],
  imports: [
    FormsModule,
    CommonModule,
    GanttRoutingModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
    AngularResizedEventModule,
    MatButtonModule,
    MatMenuModule,
    SharedModule,
    MatSidenavModule,
    MatListModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatToolbarModule,
  ],
})
export class GanttModule {}
