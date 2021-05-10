import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RootComponent } from './root/root.component';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home/tour', pathMatch: 'full' },
      { path: 'home', loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule) },
      {
        path: 'gantt',
        loadChildren: () => import('./modules/gantt/gantt.module').then((m) => m.GanttModule),
      },
      {
        path: 'overview',
        loadChildren: () => import('./modules/overview/overview.module').then((m) => m.OverviewModule),
        canActivate: [AuthGuard],
        data: { organisationRoles: ['PMO'] },
      },
      {
        path: 'schedules',
        loadChildren: () => import('./modules/schedules/schedules.module').then((m) => m.SchedulesModule),
        canActivate: [AuthGuard],
        data: { organisationRoles: ['PMO'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
