import {ChangeDetectionStrategy, Component, computed, inject, output, signal} from '@angular/core';
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

  // Expansion state
  public isExpanded = signal(false);

  // Number of variants to show in one row (lg: 3, sm: 2, default: 1)
  private variantsPerRow = 3;

  // Computed property for visible variants
  public visibleVariants = computed(() => {
    const variants = this.product()?.variants || [];
    if (this.isExpanded() || variants.length <= this.variantsPerRow) {
      return variants;
    }
    return variants.slice(0, this.variantsPerRow);
  });

  // Check if we need to show expand button
  public shouldShowExpandButton = computed(() => {
    const variants = this.product()?.variants || [];
    return variants.length > this.variantsPerRow;
  });

  public toggleExpand() {
    this.isExpanded.update(value => !value);
  }

  handleSelectVariant(variant: SelectedVariantT) {
    this.selectedVariantChanged.emit(variant);
  }
}
