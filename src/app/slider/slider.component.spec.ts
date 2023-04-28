import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SliderComponent } from './slider.component';

describe('SliderComponent', () => {
  let component: SliderComponent,
      fixture: ComponentFixture<SliderComponent>;

  const testMinOrMax = (type: 'min' | 'max', value: number, expectedValue?: number): void => {
    const lastValue: number = component[type];
    component[type] = value;
    const element: HTMLElement = fixture.debugElement.nativeElement,
          div = element.querySelector(`.slider-${type}-value`)!;
    expect(div.textContent)
      .withContext('current div content')
      .toEqual(type === 'min' ? `${lastValue}` : `${component.value} / ${lastValue}`);
    fixture.detectChanges();
    expect(div.textContent)
      .withContext('new div content')
      .toEqual(type === 'min' ?
        `${expectedValue !== undefined ? expectedValue : component[type]}` :
        `${component.value} / ${expectedValue !== undefined ? expectedValue : component[type]}`
      );
    const input: HTMLInputElement = element.querySelector('.slider') as HTMLInputElement;
    expect(+input[type])
      .withContext('input.value')
      .toEqual(expectedValue !== undefined ? expectedValue : component[type]);
  };

  const testValue = (value: number, expectedValue?: number): void => {
    const lastValue: number = component.value;
    component.value = value;
    const element: HTMLElement = fixture.debugElement.nativeElement,
          div = element.querySelector('.slider-max-value')!;
    expect(div.textContent)
      .withContext('current div content')  
      .toEqual(`${lastValue} / ${component.max}`);
    fixture.detectChanges();
    expect(div.textContent)
      .withContext('new div content')
      .toEqual(
        `${expectedValue !== undefined ? expectedValue : component.value} / ${component.max}`
      );
    const input: HTMLInputElement = element.querySelector('.slider') as HTMLInputElement;
    expect(+input.value)
      .withContext('input.value')
      .toEqual(expectedValue !== undefined ? expectedValue : component.value);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({declarations: [SliderComponent]}).compileComponents();
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    component.min = 0;
    component.max = 100;
    component.value = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when min = 50 then div.slider-min-value.textContent and input.min must be 50', () => {
    testMinOrMax('min', 50);
    testMinOrMax('min', 50, 50);
  });

  it('when min = 150 then .div.slider-min-value.textContent and input.min must be 0', () => {
    testMinOrMax('min', 150);
    testMinOrMax('min', 150, 0);
  });

  it('when max = 50 then div.slider-max-value.textContent must be 0 / 50 and input.max must be 50', () => {
    testMinOrMax('max', 50);
    testMinOrMax('max', 50, 50);
  });

  it('when max = -150 then div.slider-max-value.textContent must be 0 / 100 and input.max must be 100', () => {
    testMinOrMax('max', -150);
    testMinOrMax('max', -150, 100);
  });

  it('when value = 50 then div.slider-max-value.textContent must be 50 / 100 and input.value must be 50', () => {
    testValue(50);
    testValue(50, 50);
  });

  it('when value = 150 then div.slider-max-value.textContent must be 100 / 100 and input.value must be 100', () => {
    testValue(150);
    testValue(150, 100);
  });

  it('when value = -150 then div.slider-max-value.textContent must be 0 / 100 and input.value must be 0', () => {
    testValue(-150);
    testValue(-150, 0);
  });

  it('should disabled the component and kept the original min, max and value', () => {
    const expectMin: number = component.min,
          expectedMax: number = component.max,
          expectedValue: number = component.value;
    component.disabled = true;
    component.min = 100;
    component.max = 300;
    component.value = 150;
    fixture.detectChanges();
    testMinOrMax('min', expectMin);
    testMinOrMax('max', expectedMax);
    testValue(expectedValue);
  });
});
