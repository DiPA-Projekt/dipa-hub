import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulesRoutingModule } from './schedules-routing.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { SchedulesComponent } from './schedules.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { GanttModule } from '../gantt/gantt.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ConfigurationComponent, SchedulesComponent],
  imports: [CommonModule, SchedulesRoutingModule, MatSidenavModule, MatListModule, GanttModule, RouterModule],
})
export class SchedulesModule {}
