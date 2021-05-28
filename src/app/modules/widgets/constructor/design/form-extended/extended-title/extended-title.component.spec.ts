import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedTitleComponent } from './extended-title.component';

describe('ExtendedTitleComponent', () => {
  let component: ExtendedTitleComponent;
  let fixture: ComponentFixture<ExtendedTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
