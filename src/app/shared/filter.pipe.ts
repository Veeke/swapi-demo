import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: string[], filterString: string): string[] {
    if (value.length === 0 || filterString.length === 0) {
      return value;
    }
    const resultArray = [];
    for (const item of value){
      if (item.toLowerCase().includes(filterString?.toLowerCase())){
        resultArray.push(item);
      }
    }
    return resultArray;
  }
}
