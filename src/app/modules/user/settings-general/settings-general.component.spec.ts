import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsGeneralComponent } from './settings-general.component';

describe('SettingsGeneralComponent', () => {
  let component: SettingsGeneralComponent;
  let fixture: ComponentFixture<SettingsGeneralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsGeneralComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
