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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { MaterialModule } from '../../material/material.module';
import { RecurringEventFormComponent } from './recurring-event-form/recurring-event-form.component';
import { RecurringEventDialogComponent } from './recurring-event-dialog/recurring-event-dialog.component';

@NgModule({
  declarations: [
    ConfigurationComponent,
    SchedulesComponent,
    RecurringEventsComponent,
    RecurringEventFormComponent,
    RecurringEventDialogComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    MatSidenavModule,
    MatListModule,
    GanttModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    MaterialModule,
  ],
})
export class ConfigurationModule {}
