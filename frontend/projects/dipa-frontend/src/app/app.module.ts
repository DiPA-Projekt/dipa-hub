import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GanttMenuComponent } from './menus/gantt-menu/gantt-menu.component';
import { ApiModule, Configuration } from 'dipa-api-client';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { NavService } from './nav.service';
import { RootComponent } from './root/root.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';

const initializeKeycloak = (keycloak: KeycloakService) => () =>
  keycloak.init({
    config: environment.keycloakConfig,
  });

@NgModule({
  declarations: [AppComponent, GanttMenuComponent, RootComponent],
  imports: [
    BrowserModule,
    KeycloakAngularModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    ApiModule.forRoot(AppModule.getApiConfiguration.bind(this)),
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
  ],
  providers: [
    NavService,
    { provide: LOCALE_ID, useValue: 'de-DE' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  static getApiConfiguration(): Configuration {
    return new Configuration({
      basePath: '/api/v1',
    });
  }
}
