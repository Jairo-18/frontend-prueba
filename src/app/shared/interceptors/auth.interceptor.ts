import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError
} from 'rxjs';
import { ApiResponseInterface } from '../interfaces/api-response.interface';
import { LoginSuccessInterface } from '../../auth/interfaces/login.interface';
import { NotificationsService } from '../services/notifications.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const injector = inject(Injector);
  const notificationsService: NotificationsService =
    inject(NotificationsService);
  const tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  const authRequest: HttpRequest<unknown> = addTokenToRequest(req);

  return next(authRequest).pipe(
    catchError((err: HttpErrorResponse) => {
      const refreshToken = authService.getRefreshToken();
      switch (err.status) {
        case 401:
          if (refreshToken && !authService.getRefreshingToken) {
            tokenSubject.next('');

            return authService.refreshToken(refreshToken).pipe(
              switchMap(
                (newToken: ApiResponseInterface<LoginSuccessInterface>) => {
                  const updatedRequest = runInInjectionContext(injector, () =>
                    addTokenToRequest(
                      authRequest,
                      newToken.data?.tokens?.accessToken
                    )
                  );
                  tokenSubject.next(newToken.data?.tokens?.accessToken);
                  return next(updatedRequest);
                }
              ),
              catchError((refreshError) => {
                return throwError(refreshError);
              })
            );
          }
          if (
            refreshToken &&
            authService.getRefreshingToken &&
            !req.url.includes('refresh-token')
          ) {
            return tokenSubject.pipe(
              filter((token: string): boolean => token !== ''),
              take(1),
              switchMap((token: string) => {
                return next(
                  runInInjectionContext(injector, () =>
                    addTokenToRequest(authRequest, token)
                  )
                );
              })
            );
          }
          authService.cleanStorageAndRedirectToLogin();
          return throwError(err);
        case 403:
          notificationsService.showNotification(
            'error',
            err?.error?.message || 'Algo anda mal',
            'No estás autorizado'
          );
          return throwError(err);
        default:
          return throwError(err);
      }
    })
  );
};

export const addTokenToRequest = (
  req: HttpRequest<unknown>,
  refreshToken?: string
): HttpRequest<unknown> => {
  const authService: AuthService = inject(AuthService);
  const authToken: string = refreshToken ?? (authService.getAuthToken() || '');

  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });
};
