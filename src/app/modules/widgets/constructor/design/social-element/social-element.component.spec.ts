import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialElementComponent } from './social-element.component';

describe('SocialElementComponent', () => {
  let component: SocialElementComponent;
  let fixture: ComponentFixture<SocialElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
