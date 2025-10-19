import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {UiTooltipDirective} from "@ewandr-workspace/ui-shared-lib";

@Component({
  selector: 'lib-theme-toggle',
  imports: [MatIconModule, MatTooltipModule, UiTooltipDirective],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  currentTheme = input<'light' | 'dark'>('light');
  themeToggle = output<void>();
}
