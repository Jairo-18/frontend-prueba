import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationsService {
  /**
   * Valida la fortaleza de la contraseña.
   * Este validador personalizado comprueba que una contraseña cumpla con los siguientes requisitos de seguridad:
   * - Longitud mínima de 6 caracteres.
   * - Al menos una letra mayúscula.
   * - Al menos una letra minúscula.
   * - Al menos un carácter especial (por ejemplo: !@#$%^&*(),.?":{}|<>).
   *
   * Si la contraseña no cumple con alguno de estos requisitos, el validador devolverá un error de `passwordStrength`
   * con un mensaje descriptivo. Si la contraseña cumple con todos los criterios, devolverá `null`, indicando
   * que es válida.
   *
   * @returns ValidatorFn - Un validador de Angular que verifica la fortaleza de la contraseña.
   */
  passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isValidLength = password?.length >= 6;

      if (!hasUpperCase || !hasLowerCase || !hasSpecialChar || !isValidLength) {
        return {
          passwordStrength:
            'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un carácter especial'
        };
      }

      return null;
    };
  }

  /**
   * Valida si dos campos de contraseña coinciden.
   * @param password - Nombre del control que contiene la contraseña original.
   * @param confirmPassword - Nombre del control que contiene la confirmación de la contraseña.
   * @returns ValidatorFn - Un validador que compara los dos campos de contraseña.
   */
  passwordsMatch(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const pass = formGroup.get(password);
      const confirmPass = formGroup.get(confirmPassword);

      if (!pass?.value || !confirmPass?.value) {
        // confirmPass?.setErrors({ required: true });
        return { passwordMismatch: null };
      }

      if (pass.value !== confirmPass.value) {
        confirmPass.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPass.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Validator para checa el match de las contraseñas
   * @param controlName Nombre del control de la constraseña
   * @param matchingControlName Nombre del control de la confirmación de la constraseña
   * @returns null si los controles coinciden, de lo contrario retorna el error "passwordMatch"
   */
  static PasswordMatch(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      if (!(formGroup instanceof FormGroup)) {
        return null;
      }

      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['passwordMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({
          ...matchingControl.errors,
          passwordMatch: true
        });
      } else {
        if (matchingControl.errors) {
          delete matchingControl.errors['passwordMatch'];
          if (Object.keys(matchingControl.errors).length === 0) {
            matchingControl.setErrors(null);
          }
        }
      }

      return null;
    };
  }

  static PasswordRegex(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      if (control?.value?.length < 8) {
        return null;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

      return passwordRegex.test(control.value) ? null : { passwordRegex: true };
    };
  }
}
