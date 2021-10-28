import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { ProjectTourComponent } from './project-tour/project-tour.component';
import { LinksComponent } from './links/links.component';
import { ProductTemplatesComponent } from './product-templates/product-templates.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'tour', pathMatch: 'full' },
      { path: 'tour', component: ProjectTourComponent },
      { path: 'product-templates', component: ProductTemplatesComponent },
      { path: 'links', component: LinksComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
