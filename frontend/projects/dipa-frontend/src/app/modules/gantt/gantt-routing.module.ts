import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../auth.guard';
import { GanttComponent } from './gantt.component';
import { TemplatesViewComponent } from './timeline/templates-view/templates-view.component';
import { TimelineComponent } from './timeline/schedules/timeline.component';
import { TasksComponent } from './timeline/tasks/tasks.component';
import { ProjectOrganizationComponent } from './project-organization/project-organization.component';
import { ProjectEndComponent } from './project-end/project-end.component';
import { ProjectControlComponent } from './project-control/project-control.component';
import { ProjectQuickstartComponent } from './project-quickstart/project-quickstart.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';

const routes: Routes = [
  {
    path: ':id',
    component: GanttComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'timeline',
        children: [
          { path: '', redirectTo: 'schedules', pathMatch: 'full' },
          { path: 'tasks', component: TasksComponent },
          { path: 'schedules', component: TimelineComponent },
          { path: 'templates', component: TemplatesViewComponent },
        ],
      },
      {
        path: 'project-checklist',
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: ProjectDashboardComponent },
          { path: 'quickstart', component: ProjectQuickstartComponent },
          { path: 'control', component: ProjectControlComponent },
          { path: 'end', component: ProjectEndComponent },
        ],
      },
      { path: 'project-organization', component: ProjectOrganizationComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GanttRoutingModule {}
