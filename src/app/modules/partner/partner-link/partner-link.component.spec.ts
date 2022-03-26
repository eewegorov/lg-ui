import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartnerLinkComponent } from './partner-link.component';

describe('PartnerLinkComponent', () => {
  let component: PartnerLinkComponent;
  let fixture: ComponentFixture<PartnerLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerLinkComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
