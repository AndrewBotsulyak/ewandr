import {
  APP_INITIALIZER,
  ApplicationConfig, importProvidersFrom,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideZoneChangeDetection, provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay, withNoHttpTransferCache,
} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {provideState, provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {
  hydrationMetaReducer,
  NgRxTransferStateService,
  ProductsEffects,
  productsFeatureStore
} from "@ewandr-workspace/ngrx-store";
import {ApolloClientModule, GraphQLConfig} from "@ewandr-workspace/data-access-graphql";
import {environment} from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()), // withNoHttpTransferCache()
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    // provideAppInitializer(() => {
    //   const hydrationService = inject(NgRxTransferStateService);
    //
    //   hydrationService.restoreState();
    // }),
    provideHttpClient(
      withFetch()
    ),
    provideStore({},
      {
        metaReducers: [hydrationMetaReducer],
        runtimeChecks: {
          strictStateSerializability: false,
          strictActionSerializability: false
        },
      },
    ),
    provideState(productsFeatureStore),
    provideEffects(ProductsEffects),

    importProvidersFrom(
      ApolloClientModule.forRoot({
        shopApiUrl: environment.apiUrl,
        errorHandler: (error) => {
          console.error('GraphQL Error:', error);
        },
      } as GraphQLConfig)
    ),
  ],
};
