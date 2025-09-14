import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {ProductItemModel} from "../models/product-item.model";

@Component({
  selector: 'product-card',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle,
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
