import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../auth.guard';
import { GanttComponent } from './gantt.component';
import { TemplatesViewComponent } from './templates-view/templates-view.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ProjectEndComponent } from './project-end/project-end.component';
import { ProjectControlComponent } from './project-control/project-control.component';
import { ProjectQuickstartComponent } from './project-quickstart/project-quickstart.component';

const routes: Routes = [
  {
    path: ':id',
    component: GanttComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'timeline', component: TimelineComponent },
      { path: 'templates', component: TemplatesViewComponent },
      {
        path: 'project-checklist',
        children: [
          // { path: '', redirectTo: ':id/project-checklist/quickstart' },
          { path: 'quickstart', component: ProjectQuickstartComponent },
          { path: 'control', component: ProjectControlComponent },
          { path: 'end', component: ProjectEndComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GanttRoutingModule {}
