import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedNameComponent } from './extended-name.component';

describe('ExtendedNameComponent', () => {
  let component: ExtendedNameComponent;
  let fixture: ComponentFixture<ExtendedNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
