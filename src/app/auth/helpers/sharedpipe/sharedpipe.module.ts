import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';


@Pipe({
  name: 'numberFormat'
})

export class numberFormat implements PipeTransform {
  transform(rawNum: string) {

    const countryCodeStr = rawNum.slice(0, 3);
    const areaCodeStr = rawNum.slice(3, 6);
    const midSectionStr = rawNum.slice(6,10);

    return `(${countryCodeStr}) ${areaCodeStr}-${midSectionStr}`;
  }
}

@NgModule({
  declarations: [
    numberFormat
  ],
  exports:[
    numberFormat
  ]
})
export class SharedpipeModule { }
