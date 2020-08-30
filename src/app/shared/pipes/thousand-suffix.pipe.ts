import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSuffix'
})
export class ThousandSuffixPipe implements PipeTransform {

  transform(input: number, decimals: number): any {
    const suffixes = ["k", "M", "G", "T", "P", "E"];

    if (isNaN(input)) {
      return null;
    }

    if (input < 1000) {
      return input;
    }

    const exp = Math.floor(Math.log(input) / Math.log(1000));
    return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
  }

}
