import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitElementComponent } from './split-element.component';

describe('SplitElementComponent', () => {
  let component: SplitElementComponent;
  let fixture: ComponentFixture<SplitElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplitElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
