import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
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
import { OAuthModule } from 'angular-oauth2-oidc';
import { RootComponent } from './root/root.component';
import { ProfileSettingsMenuComponent } from './menus/profile-settings-menu/profile-settings-menu.component';
import { ProjectDialogComponent } from './modules/gantt/project-dialog/project-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, GanttMenuComponent, RootComponent, ProfileSettingsMenuComponent, ProjectDialogComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    ApiModule.forRoot(AppModule.getApiConfiguration.bind(this)),
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['/'],
        sendAccessToken: true,
      },
    }),
  ],
  providers: [NavService, { provide: LOCALE_ID, useValue: 'de-DE' }],
  bootstrap: [AppComponent],
})
export class AppModule {
  static getApiConfiguration(): Configuration {
    return new Configuration({
      basePath: '/api/v1',
    });
  }
}
