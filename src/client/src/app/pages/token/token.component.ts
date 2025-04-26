import { Component, inject } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-token',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './token.component.html',
  styleUrl: './token.component.scss'
})
export class TokenComponent {
  private apiService = inject(ApiService);
  private router = inject(Router)

  form = new FormGroup({
    token: new FormControl('', { nonNullable: true, validators: Validators.required })
  })

  onSubmit(): void {
    this.apiService.setToken(this.form.getRawValue().token);
    this.router.navigate(['/', 'jars']);
  }
}
