import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcuralItemsComponent } from './procural-items.component';

describe('ProcuralItemsComponent', () => {
  let component: ProcuralItemsComponent;
  let fixture: ComponentFixture<ProcuralItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcuralItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcuralItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
