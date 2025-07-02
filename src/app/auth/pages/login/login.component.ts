import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../../shared/services/localStorage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly _router: Router = inject(Router);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _localStorage: LocalStorageService =
    inject(LocalStorageService);

  form: FormGroup;
  eyeOpen = faEye;
  eyeClose = faEyeSlash;
  showPassword: boolean = false;

  /**
   * Se recibe la información diligenciada en el formulario.
   * @param constructor - Creación del formulario.
   * @param form - Formulario para iniciar sesión.
   * @param formStep2 - Formulario 2 de cuenta.
   */
  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * @param login - Enviamos al backend la información para que nos permita ingresar al sistema.
   */
  login(): void {
    if (this.form.invalid) return;

    this._authService.login(this.form.value).subscribe({
      next: () => {
        this._router.navigateByUrl('/organizational/users/list');
        this._authService.cleanRedirectUrl();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
