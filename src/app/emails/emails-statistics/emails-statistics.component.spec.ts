import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsStatisticsComponent } from './emails-statistics.component';

describe('EmailsStatisticsComponent', () => {
  let component: EmailsStatisticsComponent;
  let fixture: ComponentFixture<EmailsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
