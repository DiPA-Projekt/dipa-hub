import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../../material/material.module';
import { NavMenuListItemComponent} from './nav-menu-list-item.component';

@NgModule({
declarations: [
    NavMenuListItemComponent,
],
imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
],
exports: [
    NavMenuListItemComponent,
]
})
export class NavMenuListItemComponentModule { }