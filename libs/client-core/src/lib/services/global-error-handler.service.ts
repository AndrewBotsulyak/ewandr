import {ErrorHandler, inject, Injectable} from "@angular/core";
import {GlobalErrorT} from "../models/global-error.model";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationService} from "./notification.service";


@Injectable({
  providedIn: "root"
})
export class GlobalErrorHandlerService implements ErrorHandler {
  private notificationService = inject(NotificationService);

    handleError(error: GlobalErrorT): void {
      // Skip HTTP errors - they're already handled by interceptors
        if (error instanceof HttpErrorResponse) {
          console.error('HTTP Error (handled by interceptor):', error);
          return;
        }

        // Handle other errors (JavaScript, component errors, etc.)
        const message = `Something unexpected happened. Please refresh and try again.`;
        this.notificationService.showError(message, `Dismiss`);

        // Log error for debugging
        console.error('Application Error:', error);
    }


}
