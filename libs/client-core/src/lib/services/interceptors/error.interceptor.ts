import { HttpInterceptorFn, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Skip auth errors (handled by authInterceptor)
      if (error.status === 401 || error.status === 403) {
        return throwError(() => error);
      }

      const message = getErrorMessage(error.status);
      const action = getErrorAction(error.status);

      notificationService.showError(message, action);

      return throwError(() => error);
    })
  );
};

function getErrorMessage(code: number): string {
  switch (code) {
    case HttpStatusCode.BadRequest:
      return `Something doesn't look quite right. Mind checking your input and trying again?`;
    case HttpStatusCode.NotFound:
      return `We couldn't find what you're looking for. It may have moved or been removed.`;
    case HttpStatusCode.RequestTimeout:
      return `That took a bit too long. Want to give it another try?`;
    case HttpStatusCode.Conflict:
      return `Looks like this was recently updated. Refresh to see the latest changes.`;
    case HttpStatusCode.InternalServerError:
      return `Something went wrong on our end. Give it another try in a moment!`;
    case HttpStatusCode.BadGateway:
      return `Having trouble connecting to the server. Try again shortly?`;
    case HttpStatusCode.ServiceUnavailable:
      return `The service is temporarily unavailable. Please try again later.`;
    case HttpStatusCode.GatewayTimeout:
      return `The server took too long to respond. Want to try again?`;
    default:
      return `Something unexpected happened. Try again in a moment!`;
  }
}

function getErrorAction(code: number): string {
  switch (code) {
    case HttpStatusCode.BadRequest:
      return `Got it`;
    case HttpStatusCode.NotFound:
      return `Go back`;
    case HttpStatusCode.RequestTimeout:
    case HttpStatusCode.GatewayTimeout:
      return `Retry`;
    case HttpStatusCode.Conflict:
      return `Refresh`;
    case HttpStatusCode.InternalServerError:
    case HttpStatusCode.BadGateway:
    case HttpStatusCode.ServiceUnavailable:
      return `Dismiss`;
    default:
      return `Dismiss`;
  }
}
