import {ChangeDetectionStrategy, Component, Input, input, output} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {SelectedVariantT} from "../../models/product-state.model";

@Component({
  selector: 'product-variant-item',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './product-variant-item.component.html',
  styleUrl: './product-variant-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductVariantItemComponent {

  // Inputs
  variant = input.required<SelectedVariantT>();

  currentVariant = input.required<SelectedVariantT>();

  // Outputs
  selectedVariantChanged = output<SelectedVariantT>();


  handleSelectVariant(variant: SelectedVariantT) {
    this.selectedVariantChanged.emit(variant);
  }
}
