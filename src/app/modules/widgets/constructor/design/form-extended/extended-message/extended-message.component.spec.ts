import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedMessageComponent } from './extended-message.component';

describe('ExtendedMessageComponent', () => {
  let component: ExtendedMessageComponent;
  let fixture: ComponentFixture<ExtendedMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
