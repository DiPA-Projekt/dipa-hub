import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home/tour', pathMatch: 'full'},
  { path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)},
  { path: 'gantt', loadChildren: () => import('./modules/gantt/gantt.module').then(m => m.GanttModule)},
  { path: 'overview', loadChildren: () => import('./modules/overview/overview.module').then(m => m.OverviewModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
