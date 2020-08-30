import { TestBed } from '@angular/core/testing';

import { ContainerizedWidgetService } from './containerized-widget.service';

describe('ContainerizedWidgetService', () => {
  let service: ContainerizedWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContainerizedWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
