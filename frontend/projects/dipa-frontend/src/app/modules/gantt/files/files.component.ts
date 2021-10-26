import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MilestonesService } from 'dipa-api-client';
import { NavItem } from '../../../nav-item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
})
export class FilesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() private timelineId: number;
  @Input() private milestoneId: number;

  public fileItems: NavItem[] = [];

  private downloadFilesSubscription: Subscription;

  public constructor(private milestonesService: MilestonesService) {}

  public ngOnInit(): void {
    this.setFileList();
  }

  public ngOnChanges(): void {
    this.setFileList();
  }

  public ngOnDestroy(): void {
    this.downloadFilesSubscription?.unsubscribe();
  }

  private setFileList(): void {
    this.downloadFilesSubscription = this.milestonesService
      .getFilesForMilestone(this.timelineId, this.milestoneId)
      .subscribe((data) => {
        this.fileItems = data.map((x) => ({
          id: x.id,
          name: x.name,
          icon: 'description',
          url: `downloadFile/${x.id}`,
          isFile: true,
        }));
      });
  }
}
