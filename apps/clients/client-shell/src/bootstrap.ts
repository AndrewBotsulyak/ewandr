import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {provideAnimations} from "@angular/platform-browser/animations";

const browserConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideAnimations(),
  ]
};

bootstrapApplication(AppComponent, browserConfig).catch((err) =>
  console.error(err)
);
