import {gql} from "apollo-angular";

export const GET_PRODUCT = gql`
  query GetProduct($slug: String!) {
    product (slug: $slug) {
      id,
      name,
      slug,
      description,
      enabled,
      optionGroups {
        id,
        name,
        options{
          id,
          name,
          code,
          customFields {
            description,
            isColor
          }
        }
      },
      assets {
        id,
        name,
        source,
        preview,
        width,
        height
      },
      featuredAsset {
        id,
        name,
        type,
        source,
        tags {
          id,
          value
        },
        customFields
      },
      variants {
        id,
        productId,
        sku,
        name,
        price,
        currencyCode,
        priceWithTax,
        customFields,
        assets {
          id,
          name,
          source,
          preview,
          width,
          height
        }
      },
      customFields {
        shortDesc,
        shippingInfo
      }
    }
  }
`
