import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideZoneChangeDetection
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()), // withNoHttpTransferCache()
    provideZoneChangeDetection({ eventCoalescing: true }),
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
  ],
};
