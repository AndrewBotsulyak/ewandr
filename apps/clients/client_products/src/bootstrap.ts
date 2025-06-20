import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import {ProductContainerComponent} from "./app/product-container/product-container.component";

bootstrapApplication(ProductContainerComponent, appConfig).catch((err) =>
  console.error(err)
);
