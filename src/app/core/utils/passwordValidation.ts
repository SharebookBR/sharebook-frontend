import { AbstractControl } from '@angular/forms';

export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password') ? AC.get('password').value : AC.get('newPassword').value; // to get value in input tag
    const confirmPassword = AC.get('confirmPassword').value; // to get value in input tag

    if (confirmPassword === '') {
      AC.get('confirmPassword').setErrors({ required: true });
      return ({ required: true });
    }

    if (password === '') {
      AC.get('password').setErrors({ required: true });
      return ({ required: true });
    }

    if (password !== confirmPassword) {
      AC.get('confirmPassword').setErrors({ MatchPassword: false });
      return ({ MatchPassword: false });
    }

    return null;
  }
}
