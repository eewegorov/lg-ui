import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleSocialComponent } from './rule-social.component';

describe('RuleSocialComponent', () => {
  let component: RuleSocialComponent;
  let fixture: ComponentFixture<RuleSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RuleSocialComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
