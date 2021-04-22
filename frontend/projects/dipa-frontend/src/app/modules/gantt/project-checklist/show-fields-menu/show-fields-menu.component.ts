import { Input, OnInit, Output, EventEmitter, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

interface SelectOption {
  value: string;
  viewValue: string;
}

interface SelectOptionGroup {
  name: string;
  fields: SelectOption[];
}

@Component({
  selector: 'app-show-fields-menu',
  templateUrl: './show-fields-menu.component.html',
})
export class ShowFieldsMenuComponent implements OnInit {
  @Input() public showFieldsForm: FormControl;
  @Input() public entries: SelectOption[];
  @Input() public formFieldGroups: SelectOptionGroup[];
  @Input() public selectedFields: string[];
  @Output() public selectionChange = new EventEmitter();

  public formGroup: FormGroup;

  public constructor() {}

  public ngOnInit(): void {
    console.log('bla');
  }
}
