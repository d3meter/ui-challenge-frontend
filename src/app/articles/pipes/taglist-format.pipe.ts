import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taglistFormat'
})
export class TaglistFormatPipe implements PipeTransform {
  transform(tagList: string[] = []): string {
    const hashtagArray = tagList.map(tag => {
      if (tag.startsWith("#")) {
        return tag;
      } else {
        return `#${tag}`;
      }
    });
    const hashtagString = hashtagArray.join(' ');
  
    return hashtagString;
  }
}
