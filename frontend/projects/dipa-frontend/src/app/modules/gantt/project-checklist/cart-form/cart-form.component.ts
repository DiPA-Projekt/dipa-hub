import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ELBEshoppingCartResult } from 'dipa-api-client';

@Component({
  selector: 'app-cart-form',
  templateUrl: './cart-form.component.html',
  styleUrls: ['../project-task-form/project-task-form.component.scss'],
})
export class CartFormComponent implements OnInit {
  @Input() formData;
  @Input() statusList;
  @Output() dataChanged = new EventEmitter();

  formGroup: FormGroup;

  constructor(public controlContainer: ControlContainer, parent: FormGroupDirective, private fb: FormBuilder) {
    this.formGroup = parent.control;
  }

  ngOnInit(): any {
    this.setReactiveForm(this.formData);
  }

  setReactiveForm(data: ELBEshoppingCartResult[]): void {
    for (const cart of data) {
      this.cartsArray.push(
        this.fb.group({
          resultType: cart?.resultType,
          shoppingCartNumber: cart?.shoppingCartNumber,
          shoppingCartContent: cart?.shoppingCartContent,
          status: cart?.status,
        })
      );
    }
    this.formGroup.get('results').get('type').setValue('TYPE_ELBE_SC');
  }

  get emptyCart(): FormGroup {
    return this.fb.group({
      resultType: 'TYPE_ELBE_SC',
      shoppingCartNumber: '',
      shoppingCartContent: '',
      status: null,
    });
  }

  get cartsArray(): FormArray {
    return this.formGroup.get('results').get('data') as FormArray;
  }

  addCart(): void {
    this.cartsArray.push(this.emptyCart);
  }

  deleteCart(index: number): void {
    this.cartsArray.removeAt(index);
    this.dataChanged.emit();
  }
}
