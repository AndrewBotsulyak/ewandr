import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {ProductOptionsData} from "../models/details-product-option-data.model";
import {ProductDetailsService} from "../product-details/product-details.service";
import {MatTooltip} from "@angular/material/tooltip";
import {DetailsSelectOptionOutput} from "../models/details-select-option-output.model";

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

  selectOption = output<DetailsSelectOptionOutput>();

  isOptionSelected = this.service.isOptionSelected;

  handleSelectOption(optionGroupId: string, optionId: string) {
    this.selectOption.emit({
      optionGroupId,
      optionId
    });
  }
}
