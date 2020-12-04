import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartnerBannerComponent } from './partner-banner.component';

describe('PartnerBannerComponent', () => {
  let component: PartnerBannerComponent;
  let fixture: ComponentFixture<PartnerBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
