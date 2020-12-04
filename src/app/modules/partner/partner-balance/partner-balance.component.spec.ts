import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartnerBalanceComponent } from './partner-balance.component';

describe('PartnerBalanceComponent', () => {
  let component: PartnerBalanceComponent;
  let fixture: ComponentFixture<PartnerBalanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
