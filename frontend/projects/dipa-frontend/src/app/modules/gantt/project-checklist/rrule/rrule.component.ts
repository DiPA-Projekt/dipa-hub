import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FrequencyPattern, RrulePattern, WeekdayPattern } from './rrule-pattern';

@Component({
  selector: 'app-rrule',
  templateUrl: './rrule.component.html',
  styleUrls: ['./rrule.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: RruleComponent,
    },
  ],
})
export class RruleComponent implements OnInit, ControlValueAccessor {
  @Output() public dataChanged = new EventEmitter<string>();

  public pattern: RrulePattern = {
    frequency: FrequencyPattern.monthly,
    interval: 1,
    byMonthDay: 10,
    byDay: [WeekdayPattern.mo, WeekdayPattern.we, WeekdayPattern.fr],
  };

  public rruleFormGroup: FormGroup;

  private touched: boolean;

  public constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.setReactiveForm();
  }

  public onChange = (rruleString: any): void => {
    // This is intentional
  };

  public onTouched = (): void => {
    this.touched = true;
  };

  public changedData(): void {
    this.onChange(this.value);
  }

  public openedChange($event: boolean): void {
    if (!$event) {
      this.dataChanged.emit(this.value);
    }
  }

  public getRruleString(): string {
    if (!this.rruleFormGroup.valid) {
      return null;
    }

    const results = [];

    results.push('FREQ=' + this.pattern.frequency);
    if (this.pattern.frequency === 'MONTHLY') {
      if (!this.pattern.byMonthDay) {
        return '';
      }
      results.push('BYMONTHDAY=' + this.pattern.byMonthDay.toString());
    } else if (this.pattern.frequency === 'WEEKLY') {
      if (!this.pattern.byDay) {
        return '';
      }
      results.push('BYDAY=' + this.pattern.byDay.toString());
    }
    if (!this.pattern.interval) {
      return '';
    }
    results.push('INTERVAL=' + this.pattern.interval.toString());

    return results.join(';');
  }

  public writeValue(rruleString: string): void {
    const items = rruleString?.split(';');

    if (items != null) {
      items.forEach((item) => {
        const [key, value] = item.split('=');

        switch (key) {
          case 'FREQ':
            this.pattern.frequency = value as FrequencyPattern;
            break;
          case 'BYMONTHDAY':
            this.pattern.byMonthDay = parseInt(value, 10);
            break;
          case 'BYDAY':
            this.pattern.byDay = value?.split(',').map((element) => element as WeekdayPattern) || [];
            break;
          case 'INTERVAL':
            this.pattern.interval = parseInt(value, 10);
            break;
        }
      });
    }
  }

  public get value(): string {
    return this.getRruleString();
  }

  public set value(newValue: string) {
    this.writeValue(newValue);
  }

  public registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private setReactiveForm(): void {
    this.rruleFormGroup = new FormGroup({
      frequency: new FormControl(this.pattern.frequency),
      interval: new FormControl(this.pattern.interval),
      byMonthDay: new FormControl(this.pattern.byMonthDay),
      byDay: new FormControl(this.pattern.byDay),
    });
  }
}
