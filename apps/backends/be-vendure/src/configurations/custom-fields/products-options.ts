import {CustomFieldConfig, LanguageCode} from "@vendure/core";

export const productOption: CustomFieldConfig[] = [
  {
    name: 'description',
    type: 'string',
    label: [{ languageCode: LanguageCode.en, value: 'Description' }],
    ui: { component: 'textarea-form-input' },
  },
  {
    name: 'isColor',
    type: 'boolean',
    label: [{ languageCode: LanguageCode.en, value: 'Is color option?' }],
    defaultValue: false,
  },
]
