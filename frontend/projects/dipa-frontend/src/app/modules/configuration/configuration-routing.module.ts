import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigurationComponent } from './configuration.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { RecurringEventsComponent } from './recurring-events/recurring-events.component';
import { PlanTemplatesComponent } from './plan-templates/plan-templates.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      { path: '', redirectTo: 'recurring_events', pathMatch: 'full' },
      { path: 'schedules', component: SchedulesComponent },
      { path: 'recurring_events', component: RecurringEventsComponent },
      { path: 'plan_templates', component: PlanTemplatesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
