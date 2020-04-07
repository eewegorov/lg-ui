import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponMultipleComponent } from './coupon-multiple.component';

describe('CouponMultipleComponent', () => {
  let component: CouponMultipleComponent;
  let fixture: ComponentFixture<CouponMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
