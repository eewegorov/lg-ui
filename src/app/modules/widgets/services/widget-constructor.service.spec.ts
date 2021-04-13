import { TestBed } from '@angular/core/testing';

import { WidgetConstructorService } from './widget-constructor.service';

describe('WidgetConstructorService', () => {
  let service: WidgetConstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetConstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
