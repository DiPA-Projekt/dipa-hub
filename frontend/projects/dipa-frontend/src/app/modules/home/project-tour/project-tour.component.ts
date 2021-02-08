import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectFlowService, ProjectFlowStep } from 'dipa-api-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-tour',
  templateUrl: './project-tour.component.html',
  styleUrls: ['./project-tour.component.scss'],
})
export class ProjectTourComponent implements OnInit, OnDestroy {
  projectFlowSubscription: Subscription;

  projectFlowItems: ProjectFlowStep[] = [];

  constructor(private projectFlowService: ProjectFlowService) {}

  ngOnInit(): void {
    this.projectFlowSubscription = this.projectFlowService.getProjectFlow().subscribe((data: ProjectFlowStep[]) => {
      this.projectFlowItems = data;
    });
  }

  ngOnDestroy(): void {
    this.projectFlowSubscription?.unsubscribe();
  }
}
