import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementTrackingComponent } from './procurement-tracking.component';

describe('ProcurementTrackingComponent', () => {
  let component: ProcurementTrackingComponent;
  let fixture: ComponentFixture<ProcurementTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurementTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
