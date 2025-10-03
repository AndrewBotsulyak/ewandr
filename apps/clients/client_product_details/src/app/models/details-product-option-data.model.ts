import {ProductOptionGroup} from "@ewandr-workspace/data-access-graphql";

export interface ProductOptionsData {
  id: ProductOptionGroup['id'],
  title: ProductOptionGroup['name'],
  options: OptionData[],
}

export interface OptionData {
  id: string;
  name: string;
  code: string;
  description?: string;
}
