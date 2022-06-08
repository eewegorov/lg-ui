import { SelectOnClickDirective } from './select-on-click.directive';
import { ElementRef } from '@angular/core';

describe('SelectOnClickDirective', () => {
  it('should create an instance', () => {
    const directive = new SelectOnClickDirective({} as ElementRef);
    expect(directive).toBeTruthy();
  });
});
