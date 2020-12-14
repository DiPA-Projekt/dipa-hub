import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiModule, Configuration } from 'dipa-api-client';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    ApiModule.forRoot(AppModule.getApiConfiguration),
    BrowserAnimationsModule,
    CoreModule,
    SharedModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'de-DE' } ],
  bootstrap: [AppComponent]
})
export class AppModule {

  static getApiConfiguration(): Configuration {
    return new Configuration({ basePath: '/api/v1' });
  }

}
