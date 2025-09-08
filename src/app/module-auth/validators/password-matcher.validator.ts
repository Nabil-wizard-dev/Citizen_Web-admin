import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('motDePasse')?.value;
        const confirmPassword = control.get('passwordConfirmation')?.value;

        return password === confirmPassword ? null : { passwordMismatch: true };
    };
}