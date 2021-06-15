import { AbstractControl } from '@angular/forms';

export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password') ? AC.get('password').value : AC.get('newPassword').value; // to get value in input tag
    const confirmPassword = AC.get('confirmPassword').value; // to get value in input tag

    if (password !== confirmPassword) {
      AC.get('confirmPassword').setErrors({ MatchPassword: true });
      return ({ MatchPassword: true });
    } else {
      AC.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }
}
