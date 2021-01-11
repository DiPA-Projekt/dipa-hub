import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ChartComponent} from './chart/chart.component';
import {GanttComponent} from './gantt.component';

const routes: Routes = [
  { path: ':id', component: GanttComponent },
  { path: 'chart', component: ChartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GanttRoutingModule { }
