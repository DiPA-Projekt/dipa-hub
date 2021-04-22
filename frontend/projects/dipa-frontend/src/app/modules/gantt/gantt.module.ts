import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanttRoutingModule } from './gantt-routing.module';
import { GanttComponent } from './gantt.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NavMenuListItemComponent } from '../../shared/nav-menu-list-item/nav-menu-list-item.component';
import { ProjectDataComponent } from './project-data/project-data.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TemplatesComponent } from './templates-view/templates/templates.component';
import { TemplatesViewComponent } from './templates-view/templates-view.component';
import { FilesComponent } from './files/files.component';
import { ChartComponent } from './chart/chart.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ProjectChecklistComponent } from './project-checklist/project-checklist.component';
import { ChartHeaderComponent } from './chart/chart-header/chart-header.component';
import { ProjectTaskFormComponent } from './project-checklist/project-task-form/project-task-form.component';
import { ResultsFormComponent } from './project-checklist/results-form/results-form.component';
import { ListMatFormFieldComponent } from './project-checklist/list-mat-form-field/list-mat-form-field.component';
import { MaterialModule } from '../../material/material.module';
import { FlexModule } from '@angular/flex-layout';
import { ShowFieldsMenuComponent } from './project-checklist/show-fields-menu/show-fields-menu.component';

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
    ResultsFormComponent,
    ListMatFormFieldComponent,
    ShowFieldsMenuComponent,
  ],
  exports: [ChartComponent, FilesComponent, NavMenuListItemComponent],
  imports: [
    AngularResizedEventModule,
    CommonModule,
    FormsModule,
    GanttRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FlexModule,
  ],
})
export class GanttModule {}
