import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePayOrderComponent } from './generate-pay-order.component';

describe('GeneratePayOrderComponent', () => {
  let component: GeneratePayOrderComponent;
  let fixture: ComponentFixture<GeneratePayOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratePayOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePayOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
