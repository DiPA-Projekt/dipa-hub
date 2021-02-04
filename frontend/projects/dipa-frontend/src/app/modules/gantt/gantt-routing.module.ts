import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GanttComponent } from './gantt.component';
import { TemplatesViewComponent } from './templates-view/templates-view.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ProjectChecklistComponent } from './project-checklist/project-checklist.component';

const routes: Routes = [
  {
    path: ':id',
    component: GanttComponent,
    children: [
      { path: 'timeline', component: TimelineComponent },
      { path: 'templates', component: TemplatesViewComponent },
      { path: 'project-checklist', component: ProjectChecklistComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GanttRoutingModule {}
