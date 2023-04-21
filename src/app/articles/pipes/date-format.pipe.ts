import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(timestamp: number): string {
    const date = new Date(timestamp);
    const options = { day: 'numeric', month: 'short', year: 'numeric' } as const;;
    return date.toLocaleDateString('en-US', options);
  }
}