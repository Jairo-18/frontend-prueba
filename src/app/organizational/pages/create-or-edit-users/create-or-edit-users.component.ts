import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import * as uuid from 'uuid';

// Services
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../../auth/services/auth.service';
import { RelatedDataService } from '../../../shared/services/relatedData.service';

// Interfaces
import { CreateUserPanel } from '../../interfaces/create.interface';
import { RoleType } from '../../../shared/interfaces/relatedDataGeneral';
import { UserInterface } from '../../../shared/interfaces/user.interface';

// Components
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-create-or-edit-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FontAwesomeModule,
    MatIcon,
    BasePageComponent,
    LoaderComponent,
    MatDatepickerModule
  ],
  templateUrl: './create-or-edit-users.component.html',
  styleUrl: './create-or-edit-users.component.scss'
})
export class CreateOrEditUsersComponent implements OnInit {
  // Services
  private readonly _usersService = inject(UsersService);
  private readonly _relatedDataService = inject(RelatedDataService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  // Form
  userForm: FormGroup;

  // State
  showPassword = false;
  showConfirmPassword = false;
  userId = '';
  roleType: RoleType[] = [];
  isEditMode = false;
  loading = false;
  userLogged?: UserInterface;

  constructor(private _fb: FormBuilder) {
    this.userForm = this._fb.group({
      roleTypeId: ['', Validators.required],
      identificationNumber: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.getRelatedData();
    this.userLogged = this._authService.getUserLoggedIn();
    this.userId = this._activatedRoute.snapshot.params['id'];
    this.isEditMode = !!this.userId;

    if (this.isEditMode) {
      this.getUserToEdit(this.userId);
    }
  }

  /**
   * Auto-completa los campos de contraseña con el número de identificación
   */
  setPassword(): void {
    const identificationValue = this.userForm.get(
      'identificationNumber'
    )?.value;
    if (identificationValue) {
      this.userForm.patchValue({
        password: identificationValue,
        confirmPassword: identificationValue
      });
    }
  }

  /**
   * Obtiene los datos del usuario para edición
   * @param userId ID del usuario a editar
   */
  private getUserToEdit(userId: string): void {
    this.loading = true;
    this._usersService.getUserEditPanel(userId).subscribe({
      next: (res) => {
        const user = res.data;
        this.userForm.patchValue({
          userId: user.userId,
          roleTypeId: user.roleType?.roleTypeId,
          identificationNumber: user.identificationNumber,
          fullName: user.fullName,
          email: user.email,
          dateOfBirth: user.dateOfBirth
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err.error?.message || err);
        this.loading = false;
      }
    });
  }

  /**
   * Obtiene los datos relacionados necesarios para el formulario
   */
  private getRelatedData(): void {
    this.loading = true;
    this._relatedDataService.createUserRelatedData().subscribe({
      next: (res) => {
        const allRoles = res.data?.roleType || [];
        const roleName = this.userLogged?.roleType?.name;

        // Filtra roles según el usuario logueado
        this.roleType =
          roleName === 'Empleado'
            ? allRoles.filter((r) => r.name === 'Usuario')
            : allRoles;

        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos relacionados:', error);
        this.loading = false;
      }
    });
  }

  save() {
    if (this.userForm.get('identificationNumber')?.value) {
      this.setPassword();
    }
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userSave: CreateUserPanel = {
        userId: this.isEditMode ? this.userId : uuid.v4(),
        roleType: formValue.roleTypeId,
        identificationNumber: formValue.identificationNumber,
        fullName: formValue.fullName,
        email: formValue.email,
        dateOfBirth: formValue.dateOfBirth,
        password: formValue.identificationNumber,
        confirmPassword: formValue.identificationNumber
      };
      if (this.userId) {
        if (this.userForm.invalid) return;
        delete userSave.userId;
        delete userSave.password;
        delete userSave.confirmPassword;
        this._usersService.updateUser(this.userId, userSave).subscribe({
          next: () => {
            this._router.navigateByUrl('/organizational/users/list');
          },
          error: (error) => {
            console.error('Error al actualizar el usuario', error);
          }
        });
      } else {
        this._usersService.createUser(userSave).subscribe({
          next: () => {
            this._router.navigateByUrl('/organizational/users/list');
          },
          error: (err) => {
            if (err.error && err.error.message) {
              console.error('Error al registrar usuario:', err.error.message);
            } else {
              console.error('Error desconocido:', err);
            }
          }
        });
      }
    } else {
      console.error('Formulario no válido', this.userForm);
      this.userForm.markAllAsTouched();
    }
  }
}
