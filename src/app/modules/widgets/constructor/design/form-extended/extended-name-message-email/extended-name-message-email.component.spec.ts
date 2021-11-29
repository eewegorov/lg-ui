import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedNameMessageEmailComponent } from './extended-name-message-email.component';

describe('ExtendedNameComponent', () => {
  let component: ExtendedNameMessageEmailComponent;
  let fixture: ComponentFixture<ExtendedNameMessageEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedNameMessageEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedNameMessageEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
