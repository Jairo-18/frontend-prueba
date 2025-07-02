import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse
} from '@angular/common/http';
import { NotificationsService } from '../services/notifications.service';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ApiResponseCreateInterface } from '../interfaces/api-response.interface';

export const notificationsInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const notificationsService: NotificationsService =
    inject(NotificationsService);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const { message } = event.body as ApiResponseCreateInterface;
        if (message) {
          notificationsService.showNotification('success', message);
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      notificationsService.showNotification(
        'error',
        error?.error?.message || 'Ha ocurrido un error.'
      );
      return throwError(() => error);
    })
  );
};
