import { Pipe, PipeTransform } from '@angular/core';
import * as cc from 'currency-codes';

@Pipe({
  name: 'currencyCode'
})
export class CurrencyCodePipe implements PipeTransform {

  transform(value: number): string {
    const currencyCode = cc.number(String(value))?.code;
    if (!currencyCode) {
      return '';
    }
    return Intl
      .NumberFormat('en', {style:'currency', currency: currencyCode})
      .formatToParts().
      find(part => part.type === 'currency')
      ?.value ?? ''
  }

}
