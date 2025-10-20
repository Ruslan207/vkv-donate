import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import {
  ClientSideRowModelModule,
  DateFilterModule,
  LocaleModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
} from 'ag-grid-community';

bootstrapApplication(
  AppComponent,
  {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
    ],
  },
)
  .then(() => {
    ModuleRegistry.registerModules([
      ClientSideRowModelModule,
      TextFilterModule,
      NumberFilterModule,
      DateFilterModule,
      LocaleModule,
    ]);
  })
  .catch((err) => console.error(err));
