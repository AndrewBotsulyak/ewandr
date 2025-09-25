import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import {ProductDetailsComponent} from "./app/product-details/product-details.component";

bootstrapApplication(ProductDetailsComponent, appConfig).catch((err) => console.error(err));
