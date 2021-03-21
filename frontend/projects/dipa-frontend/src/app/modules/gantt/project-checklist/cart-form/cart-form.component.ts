import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ELBEshoppingCartResult } from 'dipa-api-client';

@Component({
  selector: 'app-cart-form',
  templateUrl: './cart-form.component.html',
  styleUrls: ['../project-task-form/project-task-form.component.scss'],
})
export class CartFormComponent implements OnInit {
  @Input() public formData;
  @Input() public statusList;
  @Output() public dataChanged = new EventEmitter();

  public formGroup: FormGroup;

  public constructor(public controlContainer: ControlContainer, parent: FormGroupDirective, private fb: FormBuilder) {
    this.formGroup = parent.control;
  }

  public ngOnInit(): void {
    this.setReactiveForm(this.formData);
  }

  public getFormFieldsArray(index: number): FormArray {
    return this.formGroup.get(['results', 'data', index, 'formFields']) as FormArray;
  }

  public get cartsArray(): FormArray {
    return this.formGroup.get(['results', 'data']) as FormArray;
  }

  public addCart(): void {
    this.cartsArray.push(this.emptyCart);
  }

  public deleteCart(index: number): void {
    this.cartsArray.removeAt(index);
    this.dataChanged.emit();
  }

  public onFocus(event: FocusEvent, path: (string | number)[]): void {
    const valueInput = event.target as HTMLInputElement;
    valueInput.setAttribute('data-value', this.formGroup.get(path).value || '');
  }

  public onEscape(event: KeyboardEvent, path: (string | number)[]): void {
    const valueInput = event.target as HTMLInputElement;
    valueInput.value = valueInput.getAttribute('data-value');
    this.formGroup.get(path).setValue(valueInput.value);
  }

  private setReactiveForm(data: ELBEshoppingCartResult[]): void {
    for (const cart of data) {
      this.cartsArray.push(
        this.fb.group({
          resultType: cart?.resultType,
          formFields: cart?.formFields,
        })
      );
    }
    this.formGroup.get(['results', 'type']).setValue('TYPE_ELBE_SC');
  }

  private get emptyCart(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_ELBE_SC',
      formFields: [
        {
          value: '',
          key: 'shoppingCartNumber',
          label: '',
          placeholder: '',
          required: false,
          sortOrder: '1',
          controlType: 'TEXTBOX',
          type: 'TEXT',
          show: true,
        },
        {
          value: '',
          key: 'shoppingCartContent',
          label: '',
          placeholder: '',
          required: false,
          sortOrder: '2',
          controlType: 'TEXTBOX',
          type: 'TEXT',
          show: true,
        },
        {
          value: '',
          key: 'note',
          label: 'Notizen',
          placeholder: '',
          required: false,
          sortOrder: '3',
          controlType: 'TEXTAREA',
          show: true,
        },
        {
          value: '',
          key: 'status',
          label: '',
          placeholder: '',
          required: false,
          sortOrder: '4',
          controlType: 'DROPDOWN',
          type: '',
          show: true,
          options: [
            { key: 'PLANNED', value: 'geplant' },
            { key: 'ORDERED', value: 'bestellt' },
            { key: 'APPROVED', value: 'genehmigt' },
            { key: 'DELIVERED', value: 'geliefert' },
          ],
        },
      ],
    });
  }
}
