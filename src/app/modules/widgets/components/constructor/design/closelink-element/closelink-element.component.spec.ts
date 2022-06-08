import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloselinkElementComponent } from './closelink-element.component';

describe('CloselinkElementComponent', () => {
  let component: CloselinkElementComponent;
  let fixture: ComponentFixture<CloselinkElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloselinkElementComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloselinkElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
