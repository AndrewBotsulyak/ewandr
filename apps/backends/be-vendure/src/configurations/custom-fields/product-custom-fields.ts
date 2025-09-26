import {CustomFieldConfig, LanguageCode} from "@vendure/core";
import {technicalSpecificationsField} from "./technical-specifications";

export const productCustomFields: CustomFieldConfig[] = [
  {
    name: 'shortDesc',
    type: 'text',
    label: [{ languageCode: LanguageCode.en, value: 'Short Description' }],
    ui: { component: 'textarea-form-input' },
  },
  technicalSpecificationsField
];
