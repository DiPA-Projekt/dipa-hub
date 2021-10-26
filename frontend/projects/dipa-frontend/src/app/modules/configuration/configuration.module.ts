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

@NgModule({
  declarations: [ConfigurationComponent, SchedulesComponent, RecurringEventsComponent],
  imports: [CommonModule, ConfigurationRoutingModule, MatSidenavModule, MatListModule, GanttModule, RouterModule],
})
export class ConfigurationModule {}
