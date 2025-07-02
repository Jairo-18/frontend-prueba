import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import * as uuid from 'uuid';
import { RegisterUser } from '../../interfaces/register.interface';
import { RegisterService } from '../../services/register.service';
import { RelatedDataService } from '../../../shared/services/relatedData.service';
import {} from '../../../shared/interfaces/relatedDataGeneral';
import { CustomValidationsService } from '../../../shared/services/customValidations.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    FontAwesomeModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatStepperModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formStep1: FormGroup;
  formStep2: FormGroup;
  currentStep: string = 'one';
  eyeOpen = faEye;
  eyeClose = faEyeSlash;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  private readonly _registerService: RegisterService = inject(RegisterService);
  private readonly _router: Router = inject(Router);
  private readonly _relatedDataService: RelatedDataService =
    inject(RelatedDataService);
  private readonly _customValidations: CustomValidationsService = inject(
    CustomValidationsService
  );
  private readonly _passwordValidationService: CustomValidationsService =
    inject(CustomValidationsService);

  /**
   * Se recibe la información diligenciada en el formulario.
   * @param constructor - Creación del formulario.
   * @param formStep1 - Formulario 1 de información personal.
   * @param formStep2 - Formulario 2 de cuenta.
   * @param passwordStrength - Válida que la contraseña poseea más de 6 carácteres, 1 minúscula, 1 mayúscula y 1 carácter especial.
   * @param passwordsMatch - Válida que la contraseña sea igual a confirmar contraseña.
   */
  constructor(private _fb: FormBuilder) {
    this.formStep1 = this._fb.group({
      identificationTypeId: ['', Validators.required],
      identificationNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', [Validators.required]]
    });

    this.formStep2 = this._fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        phoneCodeId: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{1,15}$/)]],
        password: [
          '',
          [
            Validators.required,
            this._passwordValidationService.passwordStrength()
          ]
        ],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: this._customValidations.passwordsMatch(
          'password',
          'confirmPassword'
        )
      }
    );
  }

  /**
   * Inicializa el campo confirmar contraseña como disable.
   * @param ngOnInit - Trae la data.
   * @param formStep2 - Le decimos al campo confirmPassword que inicie bloqueado.
   * @param formStep2 - Luego condicionamos para que al llenar password se desbloque confirmPassword.
   */
  ngOnInit(): void {
    this.formStep2.get('confirmPassword')?.disable();
    this.formStep2.get('password')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.formStep2.get('confirmPassword')?.disable();
      } else {
        this.formStep2.get('confirmPassword')?.enable();
      }
    });
  }

  /**
   * @param nextStep - Función para seguir al siguiente formulario.
   */
  nextStep() {
    if (this.formStep1.valid) {
      this.currentStep = 'two';
    }
  }

  /**
   * @param save - Envío de información al backend para registrar al usuario.
   */
  save() {
    if (this.formStep2.valid && this.formStep1.valid) {
      const userToRegister: RegisterUser = {
        userId: uuid.v4(),
        identificationType: this.formStep1.value.identificationTypeId,
        identificationNumber: this.formStep1.value.identificationNumber,
        firstName: this.formStep1.value.firstName,
        lastName: this.formStep1.value.lastName,
        email: this.formStep2.value.email,
        phoneCode: this.formStep2.value.phoneCodeId,
        phone: this.formStep2.value.phone,
        password: this.formStep2.value.password,
        confirmPassword: this.formStep2.get('confirmPassword')?.value
      };
      this._registerService.registerUser(userToRegister).subscribe({
        next: () => {
          this._router.navigate(['/auth/login']);
        }
      });
    }
  }

  /**
   * @param togglePasswordVisibility - Ver contraseña.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * @param toggleConfirmPasswordVisibility - Ver confirmar contraseña.
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
