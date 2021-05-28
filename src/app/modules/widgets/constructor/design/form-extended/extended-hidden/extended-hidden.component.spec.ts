import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedHiddenComponent } from './extended-hidden.component';

describe('ExtendedHiddenComponent', () => {
  let component: ExtendedHiddenComponent;
  let fixture: ComponentFixture<ExtendedHiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedHiddenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedHiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
