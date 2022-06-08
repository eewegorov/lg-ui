import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartnerShowComponent } from './partner-show.component';

describe('PartnerShowComponent', () => {
  let component: PartnerShowComponent;
  let fixture: ComponentFixture<PartnerShowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerShowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
