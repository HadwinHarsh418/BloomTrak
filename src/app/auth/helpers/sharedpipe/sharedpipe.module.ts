import { Directive, ElementRef, HostListener, NgModule, Pipe, PipeTransform } from '@angular/core';
import { NgControl } from '@angular/forms';


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
@Directive({
  selector: '[noLeadingSpace]'
})
export class NoLeadingSpaceDirective {
  constructor(private el: ElementRef, private ngControl: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this.el.nativeElement.value;
    const newValue = initialValue.replace(/\s/g, ''); // Remove spaces
    if (initialValue !== newValue) {
      this.el.nativeElement.value = newValue;
      this.ngControl.control.setValue(newValue);
      event.stopPropagation();
    }
  }
}
@Pipe({
  name: 'replaceSpaces'
})
export class ReplaceSpacesPipe implements PipeTransform {
  transform(value: string, replaceWith: string): string {
    if(value)
    return value.replace(/ /g, replaceWith);
  }
}

@NgModule({
  declarations: [
    numberFormat,
    NoLeadingSpaceDirective,
    ReplaceSpacesPipe
  ],
  exports:[
    numberFormat,
    NoLeadingSpaceDirective,
    ReplaceSpacesPipe
  ]
})
export class SharedpipeModule { }
