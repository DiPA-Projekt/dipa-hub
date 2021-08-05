import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rrule',
  templateUrl: './rrule.component.html',
  styleUrls: ['./rrule.component.scss'],
})
export class RruleComponent implements OnInit {
  @Input() public formField: FormGroup;
  @Input() private rruleString: string;
  @Output() public dataChanged = new EventEmitter();

  public frequency = 'MONTHLY';
  public interval = 1;
  public byMonthDay = 10;
  public byDay = ['MO', 'MI', 'FR'];

  // DTSTART:20210714T144700Z
  // RRULE:FREQ=WEEKLY;UNTIL=20210918T144300Z;COUNT=30;INTERVAL=1;WKST=MO;BYDAY=MO

  public ngOnInit(): void {
    this.parse(this.rruleString);
  }

  public changedData(): void {
    this.formField.get('value').setValue(this.getRruleString());
    this.dataChanged.emit();
  }

  public getRruleString(): string {
    const results = [];

    results.push('FREQ=' + this.frequency);
    if (this.frequency === 'MONTHLY') {
      if (!this.byMonthDay) {
        return '';
      }
      results.push('BYMONTHDAY=' + this.byMonthDay.toString());
    } else if (this.frequency === 'WEEKLY') {
      if (!this.byDay) {
        return '';
      }
      results.push('BYDAY=' + this.byDay.toString());
    }
    if (!this.interval) {
      return '';
    }
    results.push('INTERVAL=' + this.interval.toString());
    return results.join(';');
  }

  private parse(rruleString: string): void {
    const items = rruleString?.split(';');

    if (items != null) {
      items.forEach((item) => {
        const [key, value] = item.split('=');

        switch (key) {
          case 'FREQ':
            this.frequency = value;
            break;
          case 'BYMONTHDAY':
            this.byMonthDay = parseInt(value, 10);
            break;
          case 'BYDAY':
            this.byDay = value?.split(',') || [];
            break;
          case 'INTERVAL':
            this.interval = parseInt(value, 10);
            break;
        }
      });
    }
  }
}
