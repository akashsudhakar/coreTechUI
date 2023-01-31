import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyLeadUpdateComponent } from './buy-lead-update.component';

describe('BuyLeadUpdateComponent', () => {
  let component: BuyLeadUpdateComponent;
  let fixture: ComponentFixture<BuyLeadUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyLeadUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyLeadUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
