import {
  ChangeDetectionStrategy,
  Component,
  inject,
  resource,
} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CurrencyCodePipe } from '../../pipes/currency-code.pipe';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-jars',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    CurrencyCodePipe,
  ],
  templateUrl: './jars.component.html',
  styleUrl: './jars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JarsComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private snackBarService = inject(MatSnackBar);

  jars = resource({
    loader: () =>
      this.apiService.getJars().catch((e: Error) => {
        this.snackBarService.open(`Помилка сервера: ${e.message}`, 'Закрити', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        console.error(e);
        return [];
      }),
  });

  goToJar(id: string): void {
    this.router.navigate(['/', 'jars', id]);
  }
}
