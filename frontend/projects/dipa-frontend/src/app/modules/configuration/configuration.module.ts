import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { SchedulesComponent } from './schedules/schedules.component';
import { ConfigurationComponent } from './configuration.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { GanttModule } from '../gantt/gantt.module';
import { RouterModule } from '@angular/router';
import { RecurringEventsComponent } from './recurring-events/recurring-events.component';
import { PlanTemplatesComponent } from './plan-templates/plan-templates.component';
import { FlexModule } from '@angular/flex-layout';
import { MaterialModule } from '../../material/material.module';
import { MilestoneTemplatesComponent } from './milestone-templates/milestone-templates.component';
import { PlanTemplateDialogComponent } from './plan-template-dialog/plan-template-dialog.component';
import { PlanTemplateFormComponent } from './plan-template-form/plan-template-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MilestoneTemplateDialogComponent } from './milestone-template-dialog/milestone-template-dialog.component';
import { MilestoneTemplateFormComponent } from './milestone-template-form/milestone-template-form.component';

@NgModule({
  declarations: [
    ConfigurationComponent,
    SchedulesComponent,
    RecurringEventsComponent,
    PlanTemplatesComponent,
    MilestoneTemplatesComponent,
    PlanTemplateDialogComponent,
    PlanTemplateFormComponent,
    MilestoneTemplateDialogComponent,
    MilestoneTemplateFormComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    MatSidenavModule,
    MatListModule,
    GanttModule,
    RouterModule,
    FlexModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ConfigurationModule {}
