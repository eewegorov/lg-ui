import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorAudiencesComponent } from './constructor-audiences.component';

describe('ConstructorAudiencesComponent', () => {
  let component: ConstructorAudiencesComponent;
  let fixture: ComponentFixture<ConstructorAudiencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorAudiencesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorAudiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
