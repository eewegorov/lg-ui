import { DropContainerDirective } from './drop-container.directive';
import { ElementRef } from '@angular/core';

describe('DropContainerDirective', () => {
  it('should create an instance', () => {
    const directive = new DropContainerDirective({} as ElementRef);
    expect(directive).toBeTruthy();
  });
});
