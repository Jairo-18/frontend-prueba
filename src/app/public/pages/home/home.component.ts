import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { LocalStorageService } from '../../../shared/services/localStorage.service';
import { AuthService } from '../../../auth/services/auth.service';
import { LogOutInterface } from '../../../auth/interfaces/logout.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly _subscription: Subscription = new Subscription();
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _localStorage: LocalStorageService =
    inject(LocalStorageService);
  private readonly _router: Router = inject(Router);
  private _localStorageService: LocalStorageService =
    inject(LocalStorageService);

  isLoggedUser: boolean = false;
  userInfo?: UserInterface;
  user?: UserInterface;

  ngOnInit(): void {
    // Verificamos el estado de si está logueado o no
    this._subscription.add(
      this._authService._isLoggedSubject.subscribe((isLogged) => {
        this.isLoggedUser = isLogged;
        this.userInfo = this._localStorage.getUserData();
      })
    );

    this.isLoggedUser = this._authService.isAuthenticated();
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isLoggedUser = this._authService.isAuthenticated();
        this.userInfo = this._localStorage.getUserData();
      });

    this.userInfo = this._localStorage.getUserData();
  }

  logout(): void {
    // Si no hay sesión, redirige directamente al login
    if (!this.isLoggedUser) {
      this._router.navigateByUrl('/auth/login');
    } else {
      const allSessionData = this._localStorageService.getAllSessionData();

      // Validación de datos mínimos para cerrar sesión
      if (
        !allSessionData?.user?.userId ||
        !allSessionData?.tokens?.accessToken ||
        !allSessionData?.session?.accessSessionId
      ) {
        console.error('Faltan datos de sesión para cerrar sesión');
        this._authService.cleanStorageAndRedirectToLogin();
        return;
      }

      // Construcción del objeto de logout requerido por el backend
      const sessionDataToLogout: LogOutInterface = {
        userId: allSessionData.user.userId,
        accessToken: allSessionData.tokens.accessToken,
        accessSessionId: allSessionData.session.accessSessionId
      };

      // Solicita cerrar sesión al backend
      this._authService.logout(sessionDataToLogout).subscribe({
        next: () => {
          this._authService.cleanStorageAndRedirectToLogin();
          this.user = undefined;
        },
        error: () => {
          this._authService.cleanStorageAndRedirectToLogin();
        }
      });
    }
  }
}
