import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedVariantsComponent } from './extended-variants.component';

describe('ExtendedVariantsComponent', () => {
  let component: ExtendedVariantsComponent;
  let fixture: ComponentFixture<ExtendedVariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedVariantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
