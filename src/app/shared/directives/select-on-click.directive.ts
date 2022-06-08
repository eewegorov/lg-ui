import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSelectOnClick]'
})
export class SelectOnClickDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('click') onClick() {
    this.el.nativeElement.select();
  }

}
