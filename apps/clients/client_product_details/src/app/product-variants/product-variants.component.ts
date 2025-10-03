import {ChangeDetectionStrategy, Component, inject, output} from '@angular/core';
import {ProductDetailsService} from "../product-details/product-details.service";
import {SelectedVariantT} from "../models/product-state.model";
import {ProductVariantItemComponent} from "./product-variant-item/product-variant-item.component";

@Component({
  selector: 'product-variants',
  imports: [
    ProductVariantItemComponent
  ],
  templateUrl: './product-variants.component.html',
  styleUrl: './product-variants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductVariantsComponent {
  private service = inject(ProductDetailsService);

  selectedVariantChanged = output<SelectedVariantT>();

  public product = this.service.product;

  public currentVariant = this.service.currentVariant;


  handleSelectVariant(variant: SelectedVariantT) {
    this.selectedVariantChanged.emit(variant);
  }
}
