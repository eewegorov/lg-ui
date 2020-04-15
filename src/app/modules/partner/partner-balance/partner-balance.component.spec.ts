import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerBalanceComponent } from './partner-balance.component';

describe('PartnerBalanceComponent', () => {
  let component: PartnerBalanceComponent;
  let fixture: ComponentFixture<PartnerBalanceComponent>;

  beforeEach(async(() => {
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
