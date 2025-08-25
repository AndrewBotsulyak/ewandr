import {GetProductsQuery} from "@ewandr-workspace/data-access-graphql";

export type ProductItemModel = GetProductsQuery['products']['items'][number];
