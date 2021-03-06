import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MilestonesService } from 'dipa-api-client';
import { NavItem } from '../../../nav-item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
})
export class FilesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() timelineId: number;
  @Input() milestoneId: number;

  fileItems: NavItem[] = [];

  downloadFilesSubscription: Subscription;

  constructor(private milestonesService: MilestonesService) {}

  ngOnInit(): void {
    this.setFileList();
  }

  ngOnChanges(): void {
    this.setFileList();
  }

  ngOnDestroy(): void {
    this.downloadFilesSubscription?.unsubscribe();
  }

  setFileList(): void {
    this.downloadFilesSubscription = this.milestonesService
      .getFilesForMilestone(this.timelineId, this.milestoneId)
      .subscribe((data) => {
        this.fileItems = data.map((x) => ({
          id: x.id,
          name: x.name,
          icon: 'description',
          file: `/downloadFile/${x.id}`,
        }));
      });
  }
}
