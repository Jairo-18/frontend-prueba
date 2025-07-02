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
import { CustomValidationsService } from '../../../shared/services/customValidations.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
    MatSelectModule,
    MatDatepickerModule
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

  private readonly _registerService = inject(RegisterService);
  private readonly _router = inject(Router);
  private readonly _relatedDataService = inject(RelatedDataService);
  private readonly _customValidations = inject(CustomValidationsService);

  constructor(private _fb: FormBuilder) {
    this.formStep1 = this._fb.group({
      identificationNumber: ['', Validators.required],
      fullName: ['', Validators.required]
    });

    this.formStep2 = this._fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        dateOfBirth: ['', Validators.required],
        password: [
          '',
          [Validators.required, this._customValidations.passwordStrength()]
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

  nextStep(): void {
    if (this.formStep1.valid) {
      this.currentStep = 'two';
    } else {
      this.formStep1.markAllAsTouched();
    }
  }

  save(): void {
    if (this.formStep2.valid && this.formStep1.valid) {
      const userData: RegisterUser = {
        userId: uuid.v4(),
        identificationNumber: this.formStep1.value.identificationNumber,
        fullName: this.formStep1.value.fullName,
        email: this.formStep2.value.email,
        dateOfBirth: this.formStep2.value.dateOfBirth,
        password: this.formStep2.value.password,
        confirmPassword: this.formStep2.value.confirmPassword
      };

      this._registerService.registerUser(userData).subscribe({
        next: () => this._router.navigate(['/auth/login']),
        error: (error) => console.error('Registration error:', error)
      });
    } else {
      this.formStep1.markAllAsTouched();
      this.formStep2.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
