import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CouponsListComponent } from './coupons-list.component';

describe('CouponsListComponent', () => {
  let component: CouponsListComponent;
  let fixture: ComponentFixture<CouponsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CouponsListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
