import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import {UiTooltipDirective} from "@ewandr-workspace/ui-shared-lib";

@Component({
  selector: 'lib-cart-button',
  imports: [MatIconModule, MatBadgeModule, MatTooltipModule, UiTooltipDirective],
  templateUrl: './cart-button.component.html',
  styleUrl: './cart-button.component.scss'
})
export class CartButtonComponent {
  itemCount = input<number>(0);
  cartClick = output<void>();
}
