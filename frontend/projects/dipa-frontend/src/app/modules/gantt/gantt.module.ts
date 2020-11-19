import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GanttRoutingModule} from './gantt-routing.module';
import {GanttComponent} from './gantt.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {ChartComponent} from './chart/chart.component';
// import { TooltipComponent } from './tooltip/tooltip.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {AngularResizedEventModule} from 'angular-resize-event';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GanttComponent,
    ChartComponent,
    // TooltipComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    GanttRoutingModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    AngularResizedEventModule
  ]
})
export class GanttModule { }
