import { AbstractControl } from '@angular/forms';

export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    const passwordControl = AC.get('password') ?? AC.get('newPassword');
    const confirmPasswordControl = AC.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value; // to get value in input tag
    const confirmPassword = confirmPasswordControl.value; // to get value in input tag

    if (confirmPassword === '') {
      confirmPasswordControl.setErrors({ required: true });
      return ({ required: true });
    }

    if (password === '') {
      passwordControl.setErrors({ required: true });
      return ({ required: true });
    }

    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({ MatchPassword: false });
      return ({ MatchPassword: false });
    }

    return null;
  }
}
