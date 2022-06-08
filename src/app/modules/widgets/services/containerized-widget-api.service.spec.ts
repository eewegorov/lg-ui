import { TestBed } from '@angular/core/testing';

import { ContainerizedWidgetApiService } from './containerized-widget-api.service';

describe('ContainerizedWidgetApiService', () => {
  let service: ContainerizedWidgetApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContainerizedWidgetApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
