import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../../material/material.module';
import { ProjectTourComponent } from './project-tour/project-tour.component';
import { LinksComponent } from './links/links.component';
import { GanttModule } from '../gantt/gantt.module';
import { SharedModule } from '../../shared/shared.module';
import { ProductTemplatesComponent } from './product-templates/product-templates.component';
import { FlexModule } from '@angular/flex-layout';

@NgModule({
  declarations: [HomeComponent, ProjectTourComponent, LinksComponent, ProductTemplatesComponent],
  imports: [CommonModule, MaterialModule, HomeRoutingModule, GanttModule, SharedModule, FlexModule],
})
export class HomeModule {}
