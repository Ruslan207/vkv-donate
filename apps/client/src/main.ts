import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection(), provideRouter(routes)],
})
  .then(() =>
    import('ag-grid-community').then((agGridPackage) =>
      agGridPackage.ModuleRegistry.registerModules([
        agGridPackage.ClientSideRowModelModule,
        agGridPackage.TextFilterModule,
        agGridPackage.NumberFilterModule,
        agGridPackage.DateFilterModule,
        agGridPackage.LocaleModule,
        agGridPackage.RowAutoHeightModule,
      ])
    )
  )
  .catch((err) => console.error(err));
