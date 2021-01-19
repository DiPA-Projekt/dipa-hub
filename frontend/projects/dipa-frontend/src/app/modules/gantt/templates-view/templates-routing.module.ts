import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TemplatesViewComponent } from './templates-view.component';

const routes: Routes = [{ path: '', component: TemplatesViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesViewRoutingModule { }
