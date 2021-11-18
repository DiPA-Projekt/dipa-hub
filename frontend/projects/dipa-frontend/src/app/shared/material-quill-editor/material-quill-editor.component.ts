import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControlDirective, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import Quill, { Delta } from 'quill';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

@Component({
  selector: 'app-material-quill-editor',
  templateUrl: './material-quill-editor.component.html',
  styleUrls: ['./material-quill-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaterialQuillEditorComponent),
      multi: true,
    },
    {
      provide: MatFormFieldControl,
      useExisting: MaterialQuillEditorComponent,
    },
  ],
})
export class MaterialQuillEditorComponent
  implements OnInit, OnDestroy, DoCheck, ControlValueAccessor, MatFormFieldControl<any>
{
  private static nextId = 0;

  @HostBinding() public id = `material-quill-editor-input-${MaterialQuillEditorComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') public describedBy = '';

  @ViewChild('container', { read: ElementRef, static: true }) public container: ElementRef;
  @Output() public changed: EventEmitter<any> = new EventEmitter();

  public ngControl: FormControlDirective;

  public placeholderValue: string;
  public requiredValue = false;
  public disabledValue = false;

  public editor: Quill;

  public stateChanges = new Subject<void>();
  public focused: boolean;
  public errorState = false;
  public controlType: 'material-quill-editor';

  private editorValue: Delta;
  private touched: boolean;

  public constructor(public elRef: ElementRef, public injector: Injector, fm: FocusMonitor) {
    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }
  public ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl) as FormControlDirective;
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    const editorContainer = this.container.nativeElement as HTMLElement;
    const editor = editorContainer.querySelector('#editor');
    this.editor = new Quill(editor, {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'], // toggled buttons
          ['link'],
          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ color: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          ['clean'], // remove formatting button
        ],
      },
      theme: 'snow',
    });
    this.editor.on('editor-change', () => {
      this.onChange(this.getValue());
    });

    this.editor.root.addEventListener('blur', () => {
      if (!this.focused) {
        this.changed.emit(this.getValue());
      }
    });
  }

  public ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  public ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched;
      this.stateChanges.next();
    }
  }

  public onChange = (delta: any): void => {
    // This is intentional
  };

  public onTouched = (): void => {
    this.touched = true;
  };

  public writeValue(html: string): void {
    const delta = this.editor.clipboard.convert(html);
    this.editor.setContents(delta);
    this.editorValue = delta;
  }
  public registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public get value(): Delta {
    return this.editorValue;
  }
  public set value(value: Delta) {
    this.editorValue = value;
    this.editor.setContents(this.editorValue);
    this.onChange(value);
    this.stateChanges.next();
  }

  @Input()
  public get placeholder(): string {
    return this.placeholderValue;
  }
  public set placeholder(placeholder: string) {
    this.placeholderValue = placeholder;
    this.stateChanges.next();
  }

  @Input()
  public get required(): boolean {
    return this.requiredValue;
  }
  public set required(required: boolean) {
    this.requiredValue = coerceBooleanProperty(required);
    this.stateChanges.next();
  }

  @Input()
  public get disabled(): boolean {
    return this.disabledValue;
  }
  public set disabled(disabled: boolean) {
    this.disabledValue = coerceBooleanProperty(disabled);
    this.stateChanges.next();
  }

  public get empty(): boolean {
    const commentText = this.editor.getText().trim();
    return !commentText;
  }

  @HostBinding('class.floating')
  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  public onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'div') {
      const editorContainer = this.container.nativeElement as HTMLElement;
      editorContainer.querySelector('div').focus();
    }
  }

  private getValue(): string {
    if (!this.editor) {
      return undefined;
    }
    const delta = this.editor.getContents();

    const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
    return converter.convert();
  }
}
