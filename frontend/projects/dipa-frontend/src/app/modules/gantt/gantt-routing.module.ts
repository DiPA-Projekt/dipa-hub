import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChartComponent } from './chart/chart.component';
import { GanttComponent } from './gantt.component';
import { TemplatesViewComponent } from './templates-view/templates-view.component';
import { ToolkitComponent } from './toolkit/toolkit.component';

const routes: Routes = [
  { path: ':id', component: GanttComponent },
  { path: ':id/toolkit', component: ToolkitComponent },
  { path: ':id/templates', component: TemplatesViewComponent },
  { path: 'chart', component: ChartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GanttRoutingModule {}
