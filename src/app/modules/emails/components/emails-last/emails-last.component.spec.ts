import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailsLastComponent } from './emails-last.component';

describe('EmailsLastComponent', () => {
  let component: EmailsLastComponent;
  let fixture: ComponentFixture<EmailsLastComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmailsLastComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsLastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
