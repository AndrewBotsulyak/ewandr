import {ChangeDetectionStrategy, Component, input, Signal} from '@angular/core';
import {
  GetProductQuery,
  ProductSpecificationsStruct,
  ProductVariantSpecificationsStruct
} from "@ewandr-workspace/data-access-graphql";
import {ProductVariant} from "../../models/details-product-variant.model";

@Component({
  selector: 'tab-specifications',
  imports: [],
  templateUrl: './tab-specifications.component.html',
  styleUrl: './tab-specifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabSpecificationsComponent {

  product = input.required<GetProductQuery['product']>()
  productSpecifications = input.required<ProductSpecificationsStruct[]>()
  variantSpecifications = input.required<ProductVariantSpecificationsStruct[]>()
  currentVariant = input.required<ProductVariant | undefined>()

}
