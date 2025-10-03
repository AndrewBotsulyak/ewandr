import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {ProductOptionsData} from "../models/details-product-option-data.model";
import {ProductDetailsService} from "../product-details/product-details.service";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'product-options-groups',
  imports: [
    MatTooltip
  ],
  templateUrl: './product-options-groups.component.html',
  styleUrl: './product-options-groups.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductOptionsGroupsComponent {
  service = inject(ProductDetailsService);

  productOptions = input.required<ProductOptionsData[]>();

  selectOption = output<string>();

  isOptionSelected = this.service.isOptionSelected;

  handleSelectOption(optionId: string) {
    this.selectOption.emit(optionId);
  }
}
