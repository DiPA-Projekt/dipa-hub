import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExternalLink, ExternalLinksService} from 'dipa-api-client';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit, OnDestroy {

  externalLinksSubscription;

  externalLinkGroups;

  constructor(private externalLinksService: ExternalLinksService) { }

  ngOnInit(): void {
    this.externalLinksSubscription = this.externalLinksService.getExternalLinks().subscribe((data: ExternalLink[]) => {

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
