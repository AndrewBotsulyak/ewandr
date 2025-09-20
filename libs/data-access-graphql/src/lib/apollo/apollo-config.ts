import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import {inject, Injectable, makeStateKey, TransferState} from '@angular/core';
import {possibleTypesResult} from "./introspection-results";

@Injectable()
export class GraphQLConfig {
  shopApiUrl: string = '';
  errorHandler?: (error: any) => void;
}

const APOLLO_STATE_KEY = makeStateKey<any>('APOLLO_STATE');

function mergeFields(existing: any, incoming: any) {
  return {...existing, ...incoming};
}

function relaceFields(existing: any, incoming: any) {
  return incoming;
}

export function apolloClientFactory(config: GraphQLConfig): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink);
  const cache = new InMemoryCache({
    possibleTypes: possibleTypesResult.possibleTypes,
    typePolicies: {
      Query: {
        fields: {
          eligibleShippingMethods: {
            merge: relaceFields,
          },
        },
      },
      Product: {
        fields: {
          customFields: {
            merge: mergeFields,
          },
        },
      },
      Collection: {
        fields: {
          customFields: {
            merge: mergeFields,
          },
        },
      },
      Order: {
        fields: {
          lines: {
            merge: relaceFields,
          },
          shippingLines: {
            merge: relaceFields,
          },
          discounts: {
            merge: relaceFields,
          },
          shippingAddress: {
            merge: relaceFields,
          },
          billingAddress: {
            merge: relaceFields,
          },
        },
      },
      Customer: {
        fields: {
          addresses: {
            merge: relaceFields,
          },
          customFields: {
            merge: mergeFields,
          },
        },
      },
    },
  });
  const transferState = inject(TransferState);

  if (transferState.hasKey(APOLLO_STATE_KEY)) {
    cache.restore(transferState.get(APOLLO_STATE_KEY, {}));
  } else {
    transferState.onSerialize(APOLLO_STATE_KEY, () => {
      const state = cache.extract();
      cache.reset();
      return state;
    });
  }

  const shopLink = httpLink.create({ uri: config.shopApiUrl });
  // const adminLink = httpLink.create({ uri: config.adminApiUrl });

  // Роутинг между API
  // const apiLink = ApolloLink.split(
  //   (operation) => operation.getContext().clientName === 'admin',
  //   adminLink,
  //   shopLink
  // );

  // Error Link
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (config.errorHandler) {
      config.errorHandler({ graphQLErrors, networkError });
    }

    return forward ? forward(operation) : undefined;
  });

  return {
    link: ApolloLink.from([errorLink, shopLink]),
    cache,
    defaultOptions: {
      watchQuery: {
        // fetchPolicy: 'cache-first',
      },
    },
  };
}
