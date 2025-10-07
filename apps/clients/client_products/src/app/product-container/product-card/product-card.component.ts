import {Component, EventEmitter, input, Output} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {SearchProductsQuery} from "@ewandr-workspace/data-access-graphql";

@Component({
  selector: 'product-card',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product = input.required<SearchProductsQuery['search']['items'][number]>();

  @Output() productClick = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<SearchProductsQuery['search']['items'][number]>();

  handleLinkClick(ev: MouseEvent) {
    ev.preventDefault();
    this.productClick.emit();
  }

  handleAddToCart(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.addToCart.emit(this.product());
  }

  getPrice(): number {
    const priceWithTax = this.product().priceWithTax;
    if (priceWithTax.__typename === 'PriceRange') {
      return priceWithTax.min || 0;
    } else if (priceWithTax.__typename === 'SinglePrice') {
      return priceWithTax.value || 0;
    }
    return 0;
  }
}
