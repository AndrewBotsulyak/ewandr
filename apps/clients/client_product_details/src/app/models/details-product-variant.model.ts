import {GetProductQuery} from "@ewandr-workspace/data-access-graphql";

export type ProductVariant = NonNullable<GetProductQuery['product']>['variants'][number];
