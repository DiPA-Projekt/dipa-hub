import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectFlowService, ProjectFlowStep } from 'dipa-api-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-tour',
  templateUrl: './project-tour.component.html',
  styleUrls: ['./project-tour.component.scss'],
})
export class ProjectTourComponent implements OnInit, OnDestroy {
  public projectFlowItems: ProjectFlowStep[] = [];

  private projectFlowSubscription: Subscription;

  public constructor(private projectFlowService: ProjectFlowService) {}

  public ngOnInit(): void {
    this.projectFlowSubscription = this.projectFlowService.getProjectFlow().subscribe((data: ProjectFlowStep[]) => {
      this.projectFlowItems = data;
    });
  }

  public ngOnDestroy(): void {
    this.projectFlowSubscription?.unsubscribe();
  }
}
