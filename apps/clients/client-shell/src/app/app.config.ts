import {ApplicationConfig, inject, PLATFORM_ID, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {provideState, provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {ProductsEffects, productsFeatureStore} from "@ewandr-workspace/ngrx-store";
import {API_URL_TOKEN} from "@ewandr-workspace/client-core";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    {
      provide: API_URL_TOKEN,
      useValue: '/api',
    },
    provideStore(),
    provideState(productsFeatureStore),
    provideEffects(ProductsEffects),
  ],
};
