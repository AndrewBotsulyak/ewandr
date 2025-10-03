import {ChangeDetectionStrategy, Component, computed, inject, output} from '@angular/core';
import {TabSpecificationsComponent} from "./tab-specifications/tab-specifications.component";
import {ProductDetailsService} from "../product-details/product-details.service";
import {DetailsTab, DetailsTabDataI} from "../models/details-tab.model";

@Component({
  selector: 'tab-group',
  imports: [
    TabSpecificationsComponent
  ],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabGroupComponent {
  private service = inject(ProductDetailsService);

  selectedTabChanged = output<DetailsTab>();

  public readonly tabs: DetailsTabDataI[] = [
    {
      type: DetailsTab.DESCRIPTION,
      label: 'Description'
    },
    {
      type: DetailsTab.SPECIFICATIONS,
      label: 'Specifications'
    },
    {
      type: DetailsTab.REVIEWS,
      label: 'Reviews'
    },
  ]

  public readonly tabEnum = DetailsTab;

  public product = this.service.product;

  public productState = this.service.productState;

  public currentVariant = this.service.currentVariant;

  // Computed signals for specifications
  productSpecifications = computed(() => {
    const product = this.product();
    const specifications = product?.customFields?.specifications;
    return specifications || [];
  });

  variantSpecifications = computed(() => {
    const variant = this.currentVariant();
    const specifications = variant?.customFields?.specifications;
    return specifications || [];
  });

  handleActiveTab(tab: DetailsTab) {
    this.selectedTabChanged.emit(tab);
  }
}
