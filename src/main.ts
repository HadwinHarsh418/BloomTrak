import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { hmrBootstrap } from './hmr';
// import * as Sentry from "@sentry/angular";

if (environment.production) {
  enableProdMode();
}
// Sentry.init({
//   dsn:"https://695d8f21f98ec5daaf70f7fb9fc51f27@o4506984007270400.ingest.us.sentry.io/4507299924082688",
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration(),
//     // Registers and configures the Tracing integration,
//     // which automatically instruments your application to monitor its
//     // performance, including custom Angular routing instrumentation
//   ],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,

//   // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: ["http://localhost:4200/", 'http://44.196.153.74:3013/'],
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.hmr) {
  if (module['hot']) {
    hmrBootstrap(module, bootstrap);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
  }
} else {
  bootstrap().catch(err => console.log(err));
}
