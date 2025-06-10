import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RemoteEntryComponent } from './app/remote-entry/entry.component';
import {ProductContainerComponent} from "./app/product-container/product-container.component";

bootstrapApplication(ProductContainerComponent, appConfig).catch((err) =>
  console.error(err)
);
