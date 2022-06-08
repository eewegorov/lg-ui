import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponElementComponent } from './coupon-element.component';

describe('CouponElementComponent', () => {
  let component: CouponElementComponent;
  let fixture: ComponentFixture<CouponElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CouponElementComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
