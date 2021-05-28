import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedTermComponent } from './extended-term.component';

describe('ExtendedTermComponent', () => {
  let component: ExtendedTermComponent;
  let fixture: ComponentFixture<ExtendedTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedTermComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
