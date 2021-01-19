import { NgModule, NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates/templates.component';
import { TemplatesViewComponent } from './templates-view.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TemplatesViewRoutingModule } from './templates-routing.module';


@NgModule({
  declarations: [
    TemplatesViewComponent,
    TemplatesComponent
  ],
  imports: [
    CommonModule,
    TemplatesViewRoutingModule,

  ],
  exports: [
    TemplatesViewComponent,
    TemplatesComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class TemplatesViewModule { }
