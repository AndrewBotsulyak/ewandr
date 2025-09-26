import {productOption} from "./products-options";
import {productCustomFields} from "./product-custom-fields";
import {CustomFields} from "@vendure/core/dist/config/custom-field/custom-field-types";
import {technicalSpecificationsField} from "./technical-specifications";

export const customFields: CustomFields = {
  ProductOption: [
    ...productOption
  ],
  Product: [
    ...productCustomFields
  ],
  ProductVariant: [
    technicalSpecificationsField
  ]
};
