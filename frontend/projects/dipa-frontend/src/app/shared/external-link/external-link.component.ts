import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-external-link',
  templateUrl: './external-link.component.html',
})
export class ExternalLinkComponent {
  @Input() public url: string;
  @Input() public title: string;
}
