import { Component, Input, Output, EventEmitter, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const UI_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  /* tslint:disable-next-line: no-use-before-declare */
  useExisting: forwardRef(() => SwitchButtonComponent),
  multi: true
};

@Component({
  selector: 'app-switch-button',
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.scss'],
  providers: [UI_SWITCH_CONTROL_VALUE_ACCESSOR]

})
export class SwitchButtonComponent implements ControlValueAccessor {

  private _checked: boolean;
  private _disabled: boolean;
  private _reverse: boolean;

  @Input() size = 'medium';
  @Output() change = new EventEmitter<boolean>();
  @Input() labelOn = '';
  @Input() labelOff = '';

  @Input() set checked(v: boolean) {
    this._checked = v !== false;
  }

  get checked() {
    return this._checked;
  }

  @Input() set disabled(v: boolean) {
    this._disabled = v !== false;
  }

  get disabled() {
    return this._disabled;
  }

  @Input() set reverse(v: boolean) {
    this._reverse = v !== false;
  }

  get reverse() {
    return this._reverse;
  }

  @HostListener('click')
  onToggle() {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;
    this.change.emit(this.checked);
    this.changed(this.checked);
    this.touched(this.checked);
  }

  // Implement control value accessor

  changed = (_: any) => {};

  touched = (_: any) => {};

  public writeValue(obj: any) {
    if (obj !== this.checked) {
      this.checked = !!obj;
    }
  }

  public registerOnChange(fn: any) {
    this.changed = fn;
  }

  public registerOnTouched(fn: any) {
    this.touched = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    //
  }
}
