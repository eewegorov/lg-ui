import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsFilterComponent } from './emails-filter.component';

describe('EmailsFilterComponent', () => {
  let component: EmailsFilterComponent;
  let fixture: ComponentFixture<EmailsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
