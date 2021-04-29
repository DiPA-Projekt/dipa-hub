import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-end',
  templateUrl: './project-end.component.html',
})
export class ProjectEndComponent implements OnInit, OnDestroy {
  public selectedTimelineId: number;
  public timelineIdSubscription: Subscription;

  public constructor(public activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.timelineIdSubscription = this.activatedRoute.parent.parent.params.subscribe((params: Params) => {
      this.selectedTimelineId = parseInt(params.id, 10);
    });
  }

  public ngOnDestroy(): void {
    this.timelineIdSubscription?.unsubscribe();
  }
}
