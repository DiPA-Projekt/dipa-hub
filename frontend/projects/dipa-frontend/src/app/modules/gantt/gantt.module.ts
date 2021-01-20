import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GanttRoutingModule} from './gantt-routing.module';
import {GanttComponent} from './gantt.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {AngularResizedEventModule} from 'angular-resize-event';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {SharedModule} from '../../shared/shared.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {TemplatesViewModule} from './templates-view/templates-view.module';
import {MatListModule} from '@angular/material/list';
import {NavMenuListItemComponent} from '../../shared/nav-menu-list-item/nav-menu-list-item.component';
import {NavMenuListItemComponentModule} from '../../shared/nav-menu-list-item/nav-menu-list-item.module'; 
import {ToolkitComponent} from './toolkit/toolkit.component';
import {SidenavComponent} from './sidenav/sidenav.component';


@NgModule({
  declarations: [
    GanttComponent,
    // NavMenuListItemComponent
    NavMenuListItemComponent,
    ToolkitComponent,
    SidenavComponent
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
    AngularResizedEventModule,
    MatButtonModule,
    MatMenuModule,
    SharedModule,
    MatSidenavModule,
    MatListModule,
    // NavMenuListItemComponentModule
  ]
})
export class GanttModule { }
