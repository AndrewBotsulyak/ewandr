import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import {inject, Injectable, makeStateKey, TransferState} from '@angular/core';

@Injectable()
export class GraphQLConfig {
  shopApiUrl: string = '';
  errorHandler?: (error: any) => void;
}

const APOLLO_STATE_KEY = makeStateKey<any>('APOLLO_STATE');

export function apolloClientFactory(config: GraphQLConfig): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink);
  const cache = new InMemoryCache({
    typePolicies: {
      Product: {
        keyFields: ['id'],
      },
      Order: {
        keyFields: ['id'],
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
        fetchPolicy: 'cache-and-network',
      },
    },
  };
}
