import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectElementComponent } from './redirect-element.component';

describe('RedirectElementComponent', () => {
  let component: RedirectElementComponent;
  let fixture: ComponentFixture<RedirectElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
