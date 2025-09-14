import {gql} from "apollo-angular";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      items {
        id,
        name,
        slug,
        description,
        featuredAsset {
          source
        }
        customFields {
          shortDesc
        }
        variants {
          id
          productId
          sku
          name
          price
          currencyCode
          priceWithTax
        }
      }
    }
  }
`;
