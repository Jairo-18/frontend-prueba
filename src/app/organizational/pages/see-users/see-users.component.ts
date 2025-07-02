import { RoleType } from './../../../shared/interfaces/relatedDataGeneral';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchField } from './../../../shared/interfaces/search.interface';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { SearchFieldsComponent } from '../../../shared/components/search-fields/search-fields.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../auth/services/auth.service';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { UserComplete } from '../../interfaces/create.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PaginationInterface } from '../../../shared/interfaces/pagination.interface';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import { RelatedDataService } from '../../../shared/services/relatedData.service';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';

@Component({
  selector: 'app-see-users',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
    SearchFieldsComponent,
    LoaderComponent,
    MatTab,
    MatTabGroup,
    BasePageComponent
  ],
  templateUrl: './see-users.component.html',
  styleUrl: './see-users.component.scss'
})
export class SeeUsersComponent implements OnInit {
  private readonly _relatedDataService: RelatedDataService =
    inject(RelatedDataService);
  private readonly _usersService: UsersService = inject(UsersService);
  private readonly _router = inject(Router);
  private readonly _matDialog: MatDialog = inject(MatDialog);
  private readonly _authService: AuthService = inject(AuthService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SearchFieldsComponent) searchComponent!: SearchFieldsComponent;

  displayedColumns: string[] = [
    'identificationNumber',
    'fullName',
    'roleType',
    'email',
    'createdAt',
    'dateOfBirth',
    'actions'
  ];

  dataSource = new MatTableDataSource<UserComplete>([]);
  roleType: RoleType[] = [];
  userLogged: UserInterface;
  form!: FormGroup;
  showClearButton: boolean = false;
  loading: boolean = false;
  isMobile: boolean = false;
  params: any = {};
  selectedTabIndex: number = 0;
  paginationParams: PaginationInterface = {
    page: 1,
    perPage: 5,
    total: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };

  /**
   * @param searchFields - Creación del buscador.
   */
  searchFields: SearchField[] = [
    {
      name: 'search',
      label: 'Buscar',
      type: 'text',
      placeholder: ' '
    }
  ];

  /**
   * @param ngOnInit - Inicialización de las funciones.
   */
  ngOnInit(): void {
    this.loadUsers();
    this.getDataForFields();
  }

  constructor() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) this.paginationParams.perPage = 5;
    this.userLogged = this._authService.getUserLoggedIn();
  }

  /**
   * @param _getDataForFields - Obtiene los select de roles y tipos de identificación.
   */
  private getDataForFields(): void {
    this.loading = true;
    this._relatedDataService.createUserRelatedData().subscribe({
      next: (res) => {
        const role = res.data?.roleType || [];

        // Guardar para uso en los métodos getXXXName
        this.roleType = role;

        const roleOption = this.searchFields.find(
          (field) => field.name === 'roleType'
        );

        if (roleOption) {
          roleOption.options = role.map((role) => ({
            value: role.roleTypeId,
            label: role.name || ''
          }));
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando datos relacionados', err);
      }
    });
  }

  getRoleName(id: string): string {
    return this.roleType.find((r) => r.roleTypeId === id)?.name || '';
  }

  /**
   * @param onSearchSubmit - Botón de búsqueda.
   */
  onSearchSubmit(values: any): void {
    this.params = values;
    this.paginationParams.page = 1;
    this.loadUsers();
  }

  /**
   * @param onChangePagination - Cambio de paginación.
   */
  onChangePagination(event: PageEvent): void {
    this.paginationParams.page = event.pageIndex + 1;
    this.paginationParams.perPage = event.pageSize;
    this.loadUsers();
  }

  /**
   * @param onTabChange - Cambio de tabla.
   */
  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onSearchChange(form: any): void {
    this.showClearButton = !!form.length;
    this.params = form?.value;
    this.loadUsers();
  }

  /**
   * @param goToCreateUser - Ir a crear usuarios
   */
  goToCreateUser(): void {
    this._router.navigate(['/users/create']);
  }

  /**
   * @param loadUsers - Carga de usuarios.
   * @param getUserWithPagination - Obtiene los usuarios con paginación.
   */
  loadUsers(filter: string = ''): void {
    this.loading = true;
    const query = {
      page: this.paginationParams.page,
      perPage: this.paginationParams.perPage,
      search: filter,
      ...this.params
    };

    this._usersService.getUserWithPagination(query).subscribe({
      next: (res) => {
        this.dataSource.data = res.data || [];
        this.paginationParams = res?.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  /**
   * @param _deleteUser - Ellimina un usuario.
   */
  private deleteUser(userId: string): void {
    this.loading = true;
    this._usersService.deleteUserPanel(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  /**
   * @param openDeleteUserDialog - Abre un modal para eliminar un usuario.
   */
  openDeleteUserDialog(id: string): void {
    const dialogRef = this._matDialog.open(YesNoDialogComponent, {
      data: {
        title: '¿Deseas eliminar este usuario?',
        message: 'Esta acción no se puede deshacer.'
      }
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.deleteUser(id);
      }
    });
  }

  validateIfCanEditUserOrDelete(user: UserComplete): boolean {
    const loggedInRoleName = this.userLogged?.roleType?.name;
    const userToActOnRoleName = user.roleType?.name;
    const isCurrentUser = this.userLogged?.userId === user.userId;

    // Un administrador puede editar/eliminar a cualquiera, excepto a sí mismo (para eliminar)
    if (loggedInRoleName === 'Administrador') {
      // Un administrador puede editar a sí mismo, pero no eliminar
      return isCurrentUser; // Si es el mismo usuario, NO permitir eliminación (o edición si fuera el caso)
    }

    // Un empleado solo puede editar/eliminar usuarios con rol 'Usuario' y no a sí mismo.
    if (loggedInRoleName === 'Empleado') {
      return (
        userToActOnRoleName !== 'Usuario' || // No permitir si no es un usuario "regular"
        isCurrentUser // No permitir si es el mismo usuario
      );
    }

    // Por defecto, no se permite ninguna acción si no cumple las condiciones anteriores
    return true;
  }

  canEditUser(user: UserComplete): boolean {
    const loggedInRoleName = this.userLogged?.roleType?.name;
    const userToActOnRoleName = user.roleType?.name;
    const isCurrentUser = this.userLogged?.userId === user.userId;

    // El admin puede editar a cualquier usuario
    if (loggedInRoleName === 'Administrador') return true;

    // El empleado solo puede:
    // - editar usuarios con rol Usuario
    // - o editarse a sí mismo
    if (loggedInRoleName === 'Empleado') {
      return userToActOnRoleName === 'Usuario' || isCurrentUser;
    }

    return false;
  }

  canDeleteUser(user: UserComplete): boolean {
    const loggedInRoleName = this.userLogged?.roleType?.name;
    const userToActOnRoleName = user.roleType?.name;
    const isCurrentUser = this.userLogged?.userId === user.userId;

    // Nadie puede eliminarse a sí mismo
    if (isCurrentUser) return false;

    // El admin puede eliminar a cualquiera excepto a sí mismo
    if (loggedInRoleName === 'Administrador') return true;

    // El empleado solo puede eliminar usuarios con rol Usuario (no a sí mismo)
    if (loggedInRoleName === 'Empleado') {
      return userToActOnRoleName === 'Usuario';
    }

    return false;
  }
}
