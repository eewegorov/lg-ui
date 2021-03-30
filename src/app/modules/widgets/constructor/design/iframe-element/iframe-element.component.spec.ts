import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeElementComponent } from './iframe-element.component';

describe('IframeElementComponent', () => {
  let component: IframeElementComponent;
  let fixture: ComponentFixture<IframeElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IframeElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
