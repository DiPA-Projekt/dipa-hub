import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Project, ProjectService, RecurringEventType } from 'dipa-api-client';
import { Subscription } from 'rxjs';
import { RecurringEventDialogComponent } from '../recurring-event-dialog/recurring-event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { TimelineDataService } from '../../../shared/timelineDataService';

@Component({
  selector: 'app-recurring-events',
  templateUrl: './recurring-events.component.html',
  styleUrls: ['./recurring-events.component.scss'],
})
export class RecurringEventsComponent implements OnInit, OnDestroy {
  public onDelete = new EventEmitter();
  public recurringEventTypes: RecurringEventType[];

  private dataSubscription: Subscription;

  public constructor(
    public dialog: MatDialog,
    private projectService: ProjectService,
    private timelineDataService: TimelineDataService
  ) {}

  public ngOnInit(): void {
    this.dataSubscription = this.timelineDataService
      .getRecurringEvents()
      .subscribe((recurringEventTypes: RecurringEventType[]) => {
        this.recurringEventTypes = recurringEventTypes;
      });
  }

  public ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  public openRecurringEventDialog(): void {
    this.dialog.open(RecurringEventDialogComponent);
  }

  public deleteRecurringEvent(id: number): void {
    if (confirm('Wollen Sie diesen Eintrag wirklich löschen. Die Aufgabe wird aus allen Projekten entfernt!')) {
      this.projectService.deleteRecurringEventType(id).subscribe({
        next: () => {
          this.onDelete.emit();
          this.timelineDataService.setRecurringEvents();
        },
        error: null,
        complete: () => void 0,
      });
    }
  }

  public publishRecurringEvent(id: number): void {
    console.log('publishRecurringEvent', id);
  }

  public updateData(form: FormGroup): void {
    this.projectService.updateRecurringEventType(form.value).subscribe({
      next: () => {
        form.reset(form.value);
        this.timelineDataService.setRecurringEvents();
      },
      error: null,
      complete: () => void 0,
    });
  }
}
