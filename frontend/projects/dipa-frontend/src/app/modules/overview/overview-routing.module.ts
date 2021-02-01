import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {OverviewComponent} from './overview.component';
import {ProjectsComponent} from './projects/projects.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    children: [
      { path: 'projects', component: ProjectsComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewRoutingModule {}
