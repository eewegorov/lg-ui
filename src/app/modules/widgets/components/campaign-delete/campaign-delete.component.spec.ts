import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CampaignDeleteComponent } from './campaign-delete.component';

describe('CompanyDeleteComponent', () => {
  let component: CampaignDeleteComponent;
  let fixture: ComponentFixture<CampaignDeleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignDeleteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
