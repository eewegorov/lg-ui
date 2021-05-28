import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedEmailComponent } from './extended-email.component';

describe('ExtendedEmailComponent', () => {
  let component: ExtendedEmailComponent;
  let fixture: ComponentFixture<ExtendedEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
