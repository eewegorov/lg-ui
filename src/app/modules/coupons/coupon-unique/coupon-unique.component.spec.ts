import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponUniqueComponent } from './coupon-unique.component';

describe('CouponUniqueComponent', () => {
  let component: CouponUniqueComponent;
  let fixture: ComponentFixture<CouponUniqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponUniqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponUniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
