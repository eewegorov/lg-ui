import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedPhoneComponent } from './extended-phone.component';

describe('ExtendedPhoneComponent', () => {
  let component: ExtendedPhoneComponent;
  let fixture: ComponentFixture<ExtendedPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedPhoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
