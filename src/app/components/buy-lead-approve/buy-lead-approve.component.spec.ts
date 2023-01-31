import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyLeadApproveComponent } from './buy-lead-approve.component';

describe('BuyLeadApproveComponent', () => {
  let component: BuyLeadApproveComponent;
  let fixture: ComponentFixture<BuyLeadApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyLeadApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyLeadApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
