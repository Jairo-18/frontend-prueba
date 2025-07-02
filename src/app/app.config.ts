import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  ErrorStateMatcher,
  MAT_NATIVE_DATE_FORMATS,
  provideNativeDateAdapter
} from '@angular/material/core';

import { ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getMaterialPaginatorTranslations } from './shared/utilities/material-paginator-translations';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TransformDateService } from './shared/services/transform-date.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MyErrorStateMatcher } from './shared/matchers/error-state.matcher';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { notificationsInterceptorInterceptor } from './shared/interceptors/notifications.interceptor.interceptor';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNativeDateAdapter(MAT_NATIVE_DATE_FORMATS),
    provideAnimationsAsync(),
    importProvidersFrom(
      ToastrModule.forRoot({
        preventDuplicates: true
      })
    ),
    { provide: MatPaginatorIntl, useValue: getMaterialPaginatorTranslations() },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { maxWidth: '700px', width: '95vw', padding: '40px' }
    },
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: ErrorStateMatcher, useValue: new MyErrorStateMatcher() },
    provideHttpClient(
      withInterceptors([authInterceptor, notificationsInterceptorInterceptor])
    ),
    TransformDateService
  ]
};
