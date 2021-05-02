import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../auth.guard';
import { GanttComponent } from './gantt.component';
import { TemplatesViewComponent } from './templates-view/templates-view.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ProjectDataComponent } from './project-data/project-data.component';
import { ProjectOrganizationComponent } from './project-organization/project-organization.component';

const routes: Routes = [
  {
    path: ':id',
    component: GanttComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'timeline', component: TimelineComponent },
      { path: 'templates', component: TemplatesViewComponent },
      { path: 'project-checklist', component: ProjectDataComponent },
      { path: 'project-organization', component: ProjectOrganizationComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GanttRoutingModule {}
