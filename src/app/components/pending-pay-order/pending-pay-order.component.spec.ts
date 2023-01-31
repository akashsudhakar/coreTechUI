import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPayOrderComponent } from './pending-pay-order.component';

describe('PendingPayOrderComponent', () => {
  let component: PendingPayOrderComponent;
  let fixture: ComponentFixture<PendingPayOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingPayOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingPayOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
