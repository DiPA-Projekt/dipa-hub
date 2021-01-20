import { NgModule, NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates/templates.component';
import { TemplatesViewComponent } from './templates-view.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TemplatesViewRoutingModule } from './templates-routing.module';
import {NavMenuListItemComponent} from '../../../shared/nav-menu-list-item/nav-menu-list-item.component';
import {NavMenuListItemComponentModule} from '../../../shared/nav-menu-list-item/nav-menu-list-item.module'; 
import { RouterModule } from '@angular/router';
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
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
@NgModule({
  declarations: [
    TemplatesViewComponent,
    TemplatesComponent,
  ],
  imports: [
    CommonModule,
    TemplatesViewRoutingModule,
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
    MatSidenavModule,
    MatListModule,
    RouterModule,
    NavMenuListItemComponentModule

  ]
})
export class TemplatesViewModule { }
