import { bootstrapApplication } from '@angular/platform-browser';
import { RemoteEntryComponent } from './app/remote-entry/entry.component';
import { config } from './app/app.config.server';
import {ProductContainerComponent} from "./app/product-container/product-container.component";

const bootstrap = () => bootstrapApplication(ProductContainerComponent, config);

export default bootstrap;
