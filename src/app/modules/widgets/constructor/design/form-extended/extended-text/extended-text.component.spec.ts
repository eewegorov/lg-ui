import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedTextComponent } from './extended-text.component';

describe('ExtendedTextComponent', () => {
  let component: ExtendedTextComponent;
  let fixture: ComponentFixture<ExtendedTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
