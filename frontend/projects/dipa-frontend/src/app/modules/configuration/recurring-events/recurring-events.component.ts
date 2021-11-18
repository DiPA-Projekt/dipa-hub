import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RecurringEventType, ConfigurationService } from 'dipa-api-client';
import { Subscription } from 'rxjs';
import { RecurringEventDialogComponent } from '../recurring-event-dialog/recurring-event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { ConfigurationDataService } from '../../../shared/configurationDataService';
import { RecurringEventFormComponent } from '../recurring-event-form/recurring-event-form.component';

@Component({
  selector: 'app-recurring-events',
  templateUrl: './recurring-events.component.html',
  styleUrls: ['./recurring-events.component.scss'],
})
export class RecurringEventsComponent implements OnInit, OnDestroy {
  @ViewChild(RecurringEventFormComponent) public formComponent: RecurringEventFormComponent;

  public onDelete = new EventEmitter();
  public recurringEventTypes: RecurringEventType[];

  private dataSubscription: Subscription;

  public constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private configurationDataService: ConfigurationDataService
  ) {}

  public ngOnInit(): void {
    this.dataSubscription = this.configurationDataService
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
    if (
      confirm(
        'Wollen Sie diesen Eintrag wirklich löschen? Sämtliche Termine dieser Aufgabe werden aus den Projekten entfernt!'
      )
    ) {
      this.configurationService.deleteRecurringEventType(id).subscribe({
        next: () => {
          this.onDelete.emit();
          this.configurationDataService.setRecurringEvents();
        },
        error: null,
        complete: () => void 0,
      });
    }
  }

  public publishRecurringEvent(id: number): void {
    if (
      confirm(
        'Wollen Sie diesen Eintrag wirklich ausspielen? Die zugehörigen Termine werden in allen Projekten neu generiert!'
      )
    ) {
      this.configurationService.publishRecurringEventType(id).subscribe({
        next: () => {
          this.configurationDataService.setRecurringEvents();
        },
        error: null,
        complete: () => void 0,
      });
    }
  }

  public updateData(form: FormGroup): void {
    if (form.valid) {
      this.configurationService.updateRecurringEventType(form.value).subscribe({
        next: () => {
          form.reset(form.value);
          this.configurationDataService.setRecurringEvents();
        },
        error: null,
        complete: () => void 0,
      });
    }
  }
}
