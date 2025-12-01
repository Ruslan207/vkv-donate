import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  ClientSideRowModelModule,
  DateFilterModule,
  LocaleModule,
  ModuleRegistry,
  NumberFilterModule,
  RowApiModule,
  RowAutoHeightModule,
  TextFilterModule,
} from 'ag-grid-community';

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
      RowApiModule,
    ]);
  })
  .catch((err) => console.error(err));
