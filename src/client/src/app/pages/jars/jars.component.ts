import { Component, inject, resource } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CurrencyCodePipe } from '../../pipes/currency-code.pipe';

@Component({
  selector: 'app-jars',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    CurrencyCodePipe
  ],
  templateUrl: './jars.component.html',
  styleUrl: './jars.component.scss'
})
export class JarsComponent {
  private apiService = inject(ApiService);

  jars = resource({
    loader: () => this.apiService.getJars(),
  })

  goToJar(id: string): void {

  }
}
