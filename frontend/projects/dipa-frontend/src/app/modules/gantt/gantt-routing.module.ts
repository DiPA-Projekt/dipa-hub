import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ChartComponent} from './chart/chart.component';
import {GanttComponent} from './gantt.component';
import {TemplatesViewComponent} from './templates-view/templates-view.component';


const routes: Routes = [
  { path: ':id', component: GanttComponent },
  { path: 'chart', component: ChartComponent },
  { path: ':id/templates', loadChildren: () => import('./templates-view/templates-view.module').then(m => m.TemplatesViewModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GanttRoutingModule { }
