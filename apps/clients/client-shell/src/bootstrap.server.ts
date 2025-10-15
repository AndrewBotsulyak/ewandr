import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext, options?: Partial<ApplicationConfig>) => {
  const mergedConfig = options
    ? mergeApplicationConfig(config, options as ApplicationConfig)
    : config;
  return bootstrapApplication(AppComponent, mergedConfig, context);
};

export default bootstrap;
