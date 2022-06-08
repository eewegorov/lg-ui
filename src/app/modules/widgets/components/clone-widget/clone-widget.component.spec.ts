import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneWidgetComponent } from './clone-widget.component';

describe('CloneWidgetComponent', () => {
  let component: CloneWidgetComponent;
  let fixture: ComponentFixture<CloneWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloneWidgetComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
