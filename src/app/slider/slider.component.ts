import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ChangeEvent = { value: number };

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: SliderComponent
  }],
  host: {'[id]': 'id'}
})
export class SliderComponent implements AfterViewInit, ControlValueAccessor {
  private static counter: number = 0;

  @Input() id: string = `sc-${++SliderComponent.counter}`;
  @Input() disabled: boolean = false;
  private _min: number = 0;
  private _max: number = 100;
  private _value: number = this.min;
  private _touched: boolean = false;
  @Output('change') changeEvent: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();
  @ViewChild('slider') private sliderElement!: ElementRef<HTMLInputElement>;

  constructor(private readonly viewContainerRef: ViewContainerRef) { }

  ngAfterViewInit(): void {
    const element = this.sliderElement.nativeElement;
    element.style.setProperty('--value', element.value);
    element.style.setProperty('--min', element.min == '' ? '0' : element.min);
    element.style.setProperty('--max', element.max == '' ? '100' : element.max);
    element.addEventListener('input', () => element.style.setProperty('--value', element.value));
  }

  get min(): number {
    return this._min;
  }

  @Input() set min(value: number) {
    if (this.disabled || value >= this._max) {
      return;
    }
    this._min = value;
    if (this._value < value) {
      this._value = value;
    }
  }

  get max(): number {
    return this._max;
  }

  @Input() set max(value: number) {
    if (this.disabled || value <= this._min) {
      return;
    }
    this._max = value;
    if (this._value > value) {
      this._value = value;
    }
  }

  get value(): number {
    return this._value;
  }

  @Input() set value(value: number) {
    if (this.disabled) {
      return;
    }
    this._value = Math.max(this.min, Math.min(this.max, value));
    this.sliderElement?.nativeElement.style.setProperty('--value', `${value}`);
  }

  get touched(): boolean {
    return this._touched;
  }

  change(event: Event): void {
    event.stopPropagation();
    this.markAsTouched();
    const newValue: number = +(event.target as HTMLInputElement).value;
    this.changeEvent.emit({ value: newValue });
    this.onChange(newValue);
  }

  blur(event: Event): void {
    this.markAsTouched();
  }

  onChange = (quantity: any) => {};

  onTouched = () => {};

  writeValue(obj: any): void {
    this.value = +obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  markAsTouched(): void {
    if (!this._touched) {
      this.onTouched();
      this._touched = true;
    }
  }

  hostContainClass(className: string): boolean {
    return this.viewContainerRef.element.nativeElement.classList.contains(className);
  }
}
