import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsBestComponent } from './emails-best.component';

describe('EmailsBestComponent', () => {
  let component: EmailsBestComponent;
  let fixture: ComponentFixture<EmailsBestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailsBestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsBestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
