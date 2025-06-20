import {mergeApplicationConfig, ApplicationConfig, APP_BOOTSTRAP_LISTENER, inject} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import {provideNoopAnimations} from "@angular/platform-browser/animations";
import {NgRxTransferStateService} from "@ewandr-workspace/ngrx-store";

const serverConfig: ApplicationConfig = {
  providers: [
      provideServerRendering(), // provides TransferState
      provideNoopAnimations(), // replace animation when SSR
      {
        provide: APP_BOOTSTRAP_LISTENER,
        multi: true,
        useFactory: () => {
          const transferStateService = inject(NgRxTransferStateService)

          return () => {
            // save state before send HTML
            transferStateService.saveState();
          };
        },
      },
    ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
