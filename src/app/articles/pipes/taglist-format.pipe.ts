import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taglistFormat',
})
export class TaglistFormatPipe implements PipeTransform {
  transform(arrayFromBackend: string[]): string {
    let hashtagString = '#' + arrayFromBackend.join(' #');

    return hashtagString;
  }
}
