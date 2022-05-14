import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CouponAddComponent } from './coupon-add.component';

describe('CouponAddComponent', () => {
  let component: CouponAddComponent;
  let fixture: ComponentFixture<CouponAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CouponAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
