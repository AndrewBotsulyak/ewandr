import {CustomFieldConfig, LanguageCode} from "@vendure/core";

export const technicalSpecificationsField: CustomFieldConfig = {
  name: 'specifications',
  type: 'struct',
  list: true, // Указываем, что это будет список (массив) характеристик [5]
  label: [ // Метки для административного интерфейса [7]
    { languageCode: LanguageCode.en, value: 'Technical Specifications' },
    { languageCode: LanguageCode.ru, value: 'Технические характеристики' }
  ],
  // Определяем поля внутри каждой структуры [6]
  fields: [
    {
      name: 'name',
      type: 'string',
      label: [
        { languageCode: LanguageCode.en, value: 'Name' },
        { languageCode: LanguageCode.ru, value: 'Название' }
      ]
    },
    {
      name: 'value',
      type: 'string',
      label: [
        { languageCode: LanguageCode.en, value: 'Value' },
        { languageCode: LanguageCode.ru, value: 'Значение' }
      ]
    }
  ]
};
