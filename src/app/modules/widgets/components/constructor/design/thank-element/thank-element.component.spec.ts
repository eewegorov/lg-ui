import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankElementComponent } from './thank-element.component';

describe('ThankElementComponent', () => {
  let component: ThankElementComponent;
  let fixture: ComponentFixture<ThankElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThankElementComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
