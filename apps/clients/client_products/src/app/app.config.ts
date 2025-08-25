import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  provideZonelessChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {provideState, provideStore} from "@ngrx/store";
import {hydrationMetaReducer, ProductsEffects, productsFeatureStore} from "@ewandr-workspace/ngrx-store";
import {provideEffects} from "@ngrx/effects";
import {provideHttpClient, withFetch} from "@angular/common/http";
import {CheckPlatformService} from "@ewandr-workspace/client-core";
import { ProductContainerService } from './product-container/product-container.service';
import {GalleryModule} from "ng-gallery";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()), // withNoHttpTransferCache()
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(
      withFetch()
    ),
    ProductContainerService,
    CheckPlatformService,
    // TODO check if need to add store in this app also
    // looks like it works properly
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
    // provideHttpClient(withFetch()),
    // {
    //   provide: API_URL_TOKEN,
    //   useValue: 'http://be-core-service:3000/ums'
    // }
    importProvidersFrom(GalleryModule)
  ],
};
