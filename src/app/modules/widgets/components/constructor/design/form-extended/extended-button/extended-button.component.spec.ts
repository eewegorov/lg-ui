import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedButtonComponent } from './extended-button.component';

describe('ExtendedButtonComponent', () => {
  let component: ExtendedButtonComponent;
  let fixture: ComponentFixture<ExtendedButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtendedButtonComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
