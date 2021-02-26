import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root-component',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent {
  constructor(private keycloakAngular: KeycloakService) {}

  public isUserInRole(role: string): boolean {
    return this.keycloakAngular.isUserInRole(role);
  }

  public logout(): void {
    void this.keycloakAngular.logout();
  }
}
