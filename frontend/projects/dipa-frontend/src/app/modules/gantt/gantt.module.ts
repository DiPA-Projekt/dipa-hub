import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanttRoutingModule } from './gantt-routing.module';
import { GanttComponent } from './gantt.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NavMenuListItemComponent } from '../../shared/nav-menu-list-item/nav-menu-list-item.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TemplatesComponent } from './timeline/templates-view/templates/templates.component';
import { TemplatesViewComponent } from './timeline/templates-view/templates-view.component';
import { FilesComponent } from './files/files.component';
import { ChartComponent } from './chart/chart.component';
import { TimelineComponent } from './timeline/schedules/timeline.component';
import { ProjectChecklistComponent } from './project-checklist/project-checklist.component';
import { ChartHeaderComponent } from './chart/chart-header/chart-header.component';
import { ProjectTaskFormComponent } from './project-checklist/project-task-form/project-task-form.component';
import { ResultsFormComponent } from './project-checklist/results-form/results-form.component';
import { ListMatFormFieldComponent } from './project-checklist/list-mat-form-field/list-mat-form-field.component';
import { MaterialModule } from '../../material/material.module';
import { ProjectOrganizationComponent } from './project-organization/project-organization.component';
import { ProjectQuickstartComponent } from './project-quickstart/project-quickstart.component';
import { ProjectControlComponent } from './project-control/project-control.component';
import { ProjectEndComponent } from './project-end/project-end.component';
import { FlexModule } from '@angular/flex-layout';
import { ProjectRoleComponent } from './project-role/project-role.component';
import { MilestoneDialogComponent } from './chart/milestone-dialog/milestone-dialog.component';
import { TasksComponent } from './timeline/tasks/tasks.component';
import { ShowFieldsMenuComponent } from './project-checklist/show-fields-menu/show-fields-menu.component';
import { DeleteProjectDialogComponent } from './chart/chart-header/delete-project-dialog/delete-project-dialog.component';
import { ProjectSettingsDialogComponent } from './project-settings-dialog/project-settings-dialog.component';
import { RruleComponent } from './project-checklist/rrule/rrule.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { QuillModule } from 'ngx-quill';
import { TransferTeamDataDialogComponent } from './transfer-team-data-dialog/transfer-team-data-dialog.component';

@NgModule({
  declarations: [
    GanttComponent,
    NavMenuListItemComponent,
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
    ResultsFormComponent,
    ListMatFormFieldComponent,
    ProjectOrganizationComponent,
    ProjectQuickstartComponent,
    ProjectControlComponent,
    ProjectEndComponent,
    ProjectRoleComponent,
    MilestoneDialogComponent,
    TasksComponent,
    ShowFieldsMenuComponent,
    DeleteProjectDialogComponent,
    ProjectSettingsDialogComponent,
    RruleComponent,
    ProjectDashboardComponent,
    TransferTeamDataDialogComponent,
  ],
  exports: [ChartComponent, FilesComponent, NavMenuListItemComponent],
  imports: [
    AngularResizeEventModule,
    CommonModule,
    FormsModule,
    GanttRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FlexModule,
    QuillModule,
  ],
})
export class GanttModule {}
