import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestsFilterComponent } from './requests-filter.component';

describe('RequestsFilterComponent', () => {
  let component: RequestsFilterComponent;
  let fixture: ComponentFixture<RequestsFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
