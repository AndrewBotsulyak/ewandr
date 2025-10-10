import {HttpInterceptorFn, HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        // Unauthorized - redirect to login
        notificationService.showError(
          `You'll need to log in to continue. Let's get you signed in!`,
          `Sign in`
        );

      } else if (error.status === HttpStatusCode.Forbidden) {
        // Forbidden - access denied
        notificationService.showError(
          `You don't have access to this yet. Reach out to support if this seems wrong.`,
          `Contact us`
        );
      }

      return throwError(() => error);
    })
  );
};
