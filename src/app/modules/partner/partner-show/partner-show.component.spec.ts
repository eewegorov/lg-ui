import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerShowComponent } from './partner-show.component';

describe('PartnerShowComponent', () => {
  let component: PartnerShowComponent;
  let fixture: ComponentFixture<PartnerShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerShowComponent ]
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
