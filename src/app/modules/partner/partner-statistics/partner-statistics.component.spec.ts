import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartnerStatisticsComponent } from './partner-statistics.component';

describe('PartnerStatisticsComponent', () => {
  let component: PartnerStatisticsComponent;
  let fixture: ComponentFixture<PartnerStatisticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerStatisticsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
