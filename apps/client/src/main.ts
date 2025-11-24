import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import {
  ClientSideRowModelModule,
  DateFilterModule,
  LocaleModule,
  ModuleRegistry,
  NumberFilterModule,
  RowAutoHeightModule,
  TextFilterModule,
} from 'ag-grid-community';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection(), provideRouter(routes)],
})
  .then(() => {
    ModuleRegistry.registerModules([
      ClientSideRowModelModule,
      TextFilterModule,
      NumberFilterModule,
      DateFilterModule,
      LocaleModule,
      RowAutoHeightModule,
    ]);
  })
  .catch((err) => console.error(err));
