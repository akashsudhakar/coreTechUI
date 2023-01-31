import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyLeadCreateComponent } from './buy-lead-create.component';

describe('BuyLeadCreateComponent', () => {
  let component: BuyLeadCreateComponent;
  let fixture: ComponentFixture<BuyLeadCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyLeadCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyLeadCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
