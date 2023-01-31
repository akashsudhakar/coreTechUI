import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBuyLeadComponent } from './edit-buy-lead.component';

describe('EditBuyLeadComponent', () => {
  let component: EditBuyLeadComponent;
  let fixture: ComponentFixture<EditBuyLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBuyLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBuyLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
