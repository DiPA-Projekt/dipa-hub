import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appFilterItem]',
})
export class FilterItemDirective {
  @HostListener('click', ['$event'])
  public onClick(e: MouseEvent): boolean {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}
