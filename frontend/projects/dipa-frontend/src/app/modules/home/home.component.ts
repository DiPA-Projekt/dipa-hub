import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExternalLinksService} from 'dipa-api-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  externalLinksSubscription;

  externalLinkGroups;

  constructor(private externalLinksService: ExternalLinksService) { }

  ngOnInit(): void {
    this.externalLinksSubscription = this.externalLinksService.getExternalLinks().subscribe((data) => {

      this.externalLinkGroups = Object.create(null);

      data.forEach(link => {
        this.externalLinkGroups[link.category] = this.externalLinkGroups[link.category] || [];
        this.externalLinkGroups[link.category].push(link);
      });
    });
  }

  ngOnDestroy(): void {
    this.externalLinksSubscription?.unsubscribe();
  }

  // no ordering
  returnZero(): number {
    return 0;
  }

}
