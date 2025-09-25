import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import {ProductDetailsComponent} from "./app/product-details/product-details.component";

const bootstrap = () => bootstrapApplication(ProductDetailsComponent, config);

export default bootstrap;
