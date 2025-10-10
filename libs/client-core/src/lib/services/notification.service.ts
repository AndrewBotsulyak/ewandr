import { Injectable, inject } from '@angular/core';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../components/custom-snackbar/custom-snackbar.component';
import {NotificationConfig, NotificationType} from "../models/notification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  showNotification(type: NotificationType, config: NotificationConfig): MatSnackBarRef<CustomSnackbarComponent> {
    const action = config.action || this.getDefaultAction(type);
    const duration = config.duration || 6000;

    return this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        message: config.message,
        action,
        type
      },
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`]
    });
  }

  showError(message: string, action?: string): MatSnackBarRef<CustomSnackbarComponent> {
    return this.showNotification(NotificationType.ERROR, { message, action });
  }

  showWarning(message: string, action?: string): MatSnackBarRef<CustomSnackbarComponent> {
    return this.showNotification(NotificationType.WARNING, { message, action });
  }

  showSuccess(message: string, action?: string): MatSnackBarRef<CustomSnackbarComponent> {
    return this.showNotification(NotificationType.SUCCESS, { message, action });
  }

  private getDefaultAction(type: NotificationType): string {
    switch (type) {
      case 'error':
        return `Dismiss`;
      case 'warning':
        return `Got it`;
      case 'success':
        return `Close`;
      default:
        return `Dismiss`;
    }
  }
}
