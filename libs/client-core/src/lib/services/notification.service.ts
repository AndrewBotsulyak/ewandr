import { Injectable, inject } from '@angular/core';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../components/custom-snackbar/custom-snackbar.component';
import {NotificationConfig, NotificationType} from "../models/notification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly DEFAULT_DURATION = 6000;
  private readonly INFO_DURATION = 3000;

  // call this with unique configuration
  public showNotification(type: NotificationType, config: NotificationConfig): MatSnackBarRef<CustomSnackbarComponent> {
    const action = config.action ?? this.getDefaultAction(type);
    const duration = config.duration ?? this.getDuration(type);
    const horizontalPosition = config.horizontalPosition ?? 'center';
    const verticalPosition = config.verticalPosition ?? 'top';

    return this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        message: config.message,
        action,
        type
      },
      duration,
      horizontalPosition,
      verticalPosition,
      panelClass: ['notification-action', `snackbar-${type}`]
    });
  }

  public showError(message: string, action?: string): MatSnackBarRef<CustomSnackbarComponent> {
    return this.showNotification(NotificationType.ERROR, { message, action });
  }

  public showWarning(message: string, action?: string): MatSnackBarRef<CustomSnackbarComponent> {
    return this.showNotification(NotificationType.WARNING, { message, action });
  }

  public showSuccess(message: string, action?: string): MatSnackBarRef<CustomSnackbarComponent> {
    return this.showNotification(NotificationType.SUCCESS, { message, action });
  }

  public showInfo(message: string, action?: string): MatSnackBarRef<CustomSnackbarComponent> {
    return this.showNotification(NotificationType.INFO, {message, action});
  }

  private getDefaultAction(type: NotificationType): string {
    switch (type) {
      case NotificationType.ERROR:
        return `Dismiss`;
      case NotificationType.WARNING:
        return `Got it`;
      case NotificationType.SUCCESS:
        return `Close`;
      default:
        return `Dismiss`;
    }
  }

  private getDuration(type: NotificationType): number {
    switch (type) {
      case NotificationType.INFO: {
        return this.INFO_DURATION;
      }
      default:
        return this.DEFAULT_DURATION;
    }
  }
}
