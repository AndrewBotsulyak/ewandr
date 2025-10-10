import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export type NotificationType = 'error' | 'warning' | 'success';

export interface SnackbarData {
  message: string;
  action: string;
  type?: NotificationType;
}

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CustomSnackbarComponent {
  data = inject<SnackbarData>(MAT_SNACK_BAR_DATA);
  snackBarRef = inject(MatSnackBarRef);

  get notificationType(): NotificationType {
    return this.data.type || 'error';
  }

  get iconPath(): string {
    switch (this.notificationType) {
      case 'success':
        return 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z';
      case 'warning':
        return 'M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z';
      case 'error':
      default:
        return 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z';
    }
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
