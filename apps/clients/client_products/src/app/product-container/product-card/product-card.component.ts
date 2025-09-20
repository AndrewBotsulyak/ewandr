import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductItemModel} from "../models/product-item.model";
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'product-card',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({required: true}) product!: ProductItemModel;

  @Output() productClick = new EventEmitter<void>();

  handleLinkClick(ev: MouseEvent) {
    ev.preventDefault();
    this.productClick.emit();
  }
}
