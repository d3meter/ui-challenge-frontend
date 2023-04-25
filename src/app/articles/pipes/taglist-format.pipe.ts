import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taglistFormat',
})
export class TaglistFormatPipe implements PipeTransform {
  transform(arrayFromBackend: string[]): string {
/*     const filterValue = value
      .replace(/[,.*+?^${}()|[\]\\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const arrayFrom = filterValue.split(' '); */

    let hashtagString = '#' + arrayFromBackend.join(' #');

    return hashtagString;
  }
}
