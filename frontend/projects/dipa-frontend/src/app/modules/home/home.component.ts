import { Component, OnInit } from '@angular/core';
import { ExternalLinksService } from 'dipa-api-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  externalLinks$ = this.externalLinksService.getExternalLinks();

  constructor(private externalLinksService: ExternalLinksService) {}

  ngOnInit(): void {}
}
