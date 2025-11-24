import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CurrencyCodePipe } from '../../pipes/currency-code.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jars',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    CurrencyCodePipe
  ],
  templateUrl: './jars.component.html',
  styleUrl: './jars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JarsComponent {
  private apiService = inject(ApiService);
  private router = inject(Router)

  jars = resource({
    loader: () => this.apiService.getJars(),
  })

  goToJar(id: string): void {
    this.router.navigate(['/', 'jars', id]);
  }
}
