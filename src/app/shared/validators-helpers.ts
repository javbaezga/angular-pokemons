import { FormControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: FormControl): ValidationErrors | null {
  const value: string = control.value || '';
  if (value === '') {
    return null;
  }
  return value.trim() ? null : {'whitespace': true};
}