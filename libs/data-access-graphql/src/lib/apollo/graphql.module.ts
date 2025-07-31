import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import {APOLLO_OPTIONS, provideApollo} from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { apolloClientFactory, GraphQLConfig } from './apollo-config';

@NgModule()
export class ApolloClientModule {
  constructor(@Optional() @SkipSelf() parentModule?: ApolloClientModule) {
    if (parentModule) {
      throw new Error('ApolloClientModule is already loaded. Import it only once in AppModule');
    }
  }

  static forRoot(config: GraphQLConfig): ModuleWithProviders<ApolloClientModule> {
    return {
      ngModule: ApolloClientModule,
      providers: [
        provideApollo(() => apolloClientFactory(config)),
        // {
        //   provide: APOLLO_OPTIONS,
        //   useFactory: apolloClientFactory,
        //   deps: [HttpLink, [new Optional(), GraphQLConfig]],
        // },
        {
          provide: GraphQLConfig,
          useValue: config,
        },
      ],
    };
  }
}
