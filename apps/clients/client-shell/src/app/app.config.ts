import {
  ApplicationConfig, ErrorHandler, importProvidersFrom,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {provideState, provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {
  hydrationMetaReducer,
  ProductsEffects,
  productsFeatureStore
} from "@ewandr-workspace/ngrx-store";
import {ApolloClientModule, GraphQLConfig} from "@ewandr-workspace/data-access-graphql";
import {environment} from "../environments/environment";
import {
  API_URL_TOKEN,
  authInterceptor,
  errorInterceptor,
  GlobalErrorHandlerService
} from "@ewandr-workspace/client-core";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()), // withNoHttpTransferCache()
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    // provideAppInitializer(() => {
    //   const hydrationService = inject(NgRxTransferStateService);
    //
    //   hydrationService.restoreState();
    // }),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        errorInterceptor
      ])
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
      } as GraphQLConfig),
    ),
    {
      provide: API_URL_TOKEN,
      useValue: environment.apiUrl
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    }
  ],
};
