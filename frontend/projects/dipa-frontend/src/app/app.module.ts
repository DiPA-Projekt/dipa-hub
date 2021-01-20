import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GanttMenuComponent} from './menus/gantt-menu/gantt-menu.component';
import {ApiModule, Configuration} from 'dipa-api-client';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from './core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './material/material.module';
import {SharedModule} from './shared/shared.module';
import {NavMenuListItemComponentModule} from './shared/nav-menu-list-item/nav-menu-list-item.module';

import {NavService} from './nav.service';

@NgModule({
  declarations: [
    AppComponent, GanttMenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    ApiModule.forRoot(AppModule.getApiConfiguration),
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    // NavMenuListItemComponentModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'de-DE' }, NavService ],
  bootstrap: [AppComponent]
})
export class AppModule {

  static getApiConfiguration(): Configuration {
    return new Configuration({ basePath: '/api/v1' });
  }

}
