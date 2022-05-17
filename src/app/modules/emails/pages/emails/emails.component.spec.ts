import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailsComponent } from './emails.component';

describe('EmailsComponent', () => {
  let component: EmailsComponent;
  let fixture: ComponentFixture<EmailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
