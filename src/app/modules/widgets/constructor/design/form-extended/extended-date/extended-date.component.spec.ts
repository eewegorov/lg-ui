import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedDateComponent } from './extended-date.component';

describe('ExtendedDateComponent', () => {
  let component: ExtendedDateComponent;
  let fixture: ComponentFixture<ExtendedDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
