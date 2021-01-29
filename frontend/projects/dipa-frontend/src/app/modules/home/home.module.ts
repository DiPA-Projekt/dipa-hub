import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {MaterialModule} from '../../material/material.module';
import {ProjectTourComponent} from './project-tour/project-tour.component';
import {LinksComponent} from './links/links.component';
import {GanttModule} from '../gantt/gantt.module';


@NgModule({
  declarations: [HomeComponent, ProjectTourComponent, LinksComponent],
  imports: [
    CommonModule,
    MaterialModule,
    HomeRoutingModule,
    GanttModule
  ]
})
export class HomeModule { }
