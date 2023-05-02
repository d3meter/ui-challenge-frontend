import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taglistFilter'
})
export class TaglistFilterPipe implements PipeTransform {

  transform(tagList: string): string[] {
    if (typeof tagList !== 'string') {
      return [];
    }
    const formattagList = tagList
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const arrayFormated = formattagList.split(' ');

    return arrayFormated;
  }
}