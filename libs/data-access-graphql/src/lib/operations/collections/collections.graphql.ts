import {gql} from "apollo-angular";
import {ASSET_FRAGMENT} from "../common/fragments.graphql";

export const GET_COLLECTIONS = gql`
    query GetCollections($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                parent {
                    id
                    name
                    slug
                }
                featuredAsset {
                    ...Asset
                }
            }
        }
    }
    ${ASSET_FRAGMENT}
`;

export const GET_COLLECTION = gql`
  query getCollection($slug: String) {
    collection(slug: $slug) {
      id,
      name,
      slug,
      children {
        id,
        name,
        slug,
        featuredAsset {
          ...Asset
        }
      },
      breadcrumbs {
        id,
        name,
        slug
      }
    }
  }
    ${ASSET_FRAGMENT}
`;
