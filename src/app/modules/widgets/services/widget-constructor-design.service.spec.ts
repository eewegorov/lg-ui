import { TestBed } from '@angular/core/testing';

import { WidgetConstructorDesignService } from './widget-constructor-design.service';

describe('WidgetConstructorDesignService', () => {
  let service: WidgetConstructorDesignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetConstructorDesignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
