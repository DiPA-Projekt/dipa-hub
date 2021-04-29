import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-quickstart',
  templateUrl: './project-quickstart.component.html',
})
export class ProjectQuickstartComponent implements OnInit, OnDestroy {
  public selectedTimelineId: number;
  public timelineIdSubscription: Subscription;

  public constructor(public activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.timelineIdSubscription = this.activatedRoute.parent.parent.params.subscribe({
      next: (params: Params) => {
        this.selectedTimelineId = parseInt(params.id, 10);
      },
      error: null,
      complete: () => void 0,
    });
  }

  public ngOnDestroy(): void {
    this.timelineIdSubscription?.unsubscribe();
  }
}
