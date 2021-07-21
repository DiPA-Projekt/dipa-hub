import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-list-mat-form-field',
  templateUrl: './list-mat-form-field.component.html',
  styleUrls: ['../project-task-form/project-task-form.component.scss'],
})
export class ListMatFormFieldComponent implements OnInit, AfterViewChecked {
  @Input() public formField: FormGroup;
  @Output() public dataChanged = new EventEmitter();
  @ViewChild('scrollChip') private myScrollChipContainer: ElementRef;

  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public chips: string[];

  public formGroup: FormGroup;

  public constructor(public controlContainer: ControlContainer, public formGroupDirective: FormGroupDirective) {
    this.formGroup = formGroupDirective.control;
  }

  public ngOnInit(): void {
    const formFieldValue = this.formField.get('value').value as string;
    this.chips = formFieldValue?.length > 0 ? formFieldValue.split(',') : [];
    this.scrollToBottom();
  }

  public ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  public add(event: MatChipInputEvent, formField: FormGroup): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.chips.push(value.trim());
      formField.get('value').setValue(this.chips.join(','));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.dataChanged.emit();
  }

  public remove(chip: string, formField: FormGroup): void {
    const index = this.chips.indexOf(chip);

    if (index >= 0) {
      this.chips.splice(index, 1);
      formField.get('value').setValue(this.chips.join(','));

      this.dataChanged.emit();
    }
  }

  private scrollToBottom(): void {
    try {
      const scrollChipContainer = this.myScrollChipContainer.nativeElement as HTMLElement;
      scrollChipContainer.scrollTop = scrollChipContainer.scrollHeight;
    } catch (err) {}
  }
}
